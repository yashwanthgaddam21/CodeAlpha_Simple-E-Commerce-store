const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const TAX_RATE = 0.18; // 18% GST
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

// @desc    Place order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Validate stock & build order items
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product "${item.name}" is no longer available`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${item.name}". Available: ${product.stock}`);
    }
    orderItems.push({
      product: product._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    });
  }

  const subtotal = cart.totalPrice;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((subtotal + tax + shippingCost).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    subtotal,
    tax,
    shippingCost,
    total,
    notes,
    statusHistory: [{ status: 'pending', note: 'Order placed successfully' }],
  });

  // Deduct stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Clear cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  const populated = await Order.findById(order._id).populate('user', 'name email');
  res.status(201).json({ success: true, data: populated });
});

// @desc    Get my orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Allow access to own orders or admins
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json({ success: true, data: order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  if (!['pending', 'processing'].includes(order.orderStatus)) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = new Date();
  order.cancellationReason = req.body.reason || 'Cancelled by customer';
  order.statusHistory.push({ status: 'cancelled', note: order.cancellationReason });

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  await order.save();
  res.json({ success: true, data: order });
});

// ===== ADMIN =====

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const filter = status ? { orderStatus: status } : {};
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: orders });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;
  order.statusHistory.push({ status, note: note || `Status updated to ${status}` });

  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
  }
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
  }

  await order.save();
  res.json({ success: true, data: order });
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const User = require('../models/User');

  const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders, ordersByStatus] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find().populate('user', 'name email').sort('-createdAt').limit(10),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      ordersByStatus,
    },
  });
});

module.exports = {
  placeOrder, getMyOrders, getOrderById, cancelOrder,
  getAllOrders, updateOrderStatus, getAdminStats,
};
