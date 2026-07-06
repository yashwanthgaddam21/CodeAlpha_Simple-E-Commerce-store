const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images stock isActive');
  if (!cart) {
    return res.json({ success: true, data: { items: [], totalPrice: 0 } });
  }
  res.json({ success: true, data: cart });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  const price = product.discountPercentage > 0 ? product.discountPrice : product.price;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    const newQty = cart.items[itemIndex].quantity + quantity;
    if (newQty > product.stock) {
      res.status(400);
      throw new Error(`Cannot add more. Only ${product.stock} items in stock`);
    }
    cart.items[itemIndex].quantity = newQty;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      image: product.images[0] || '',
      price,
      quantity,
    });
  }

  cart.calculateTotal();
  await cart.save();

  res.json({ success: true, data: cart });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  } else {
    const product = await Product.findById(item.product);
    if (product && quantity > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available`);
    }
    item.quantity = quantity;
  }

  cart.calculateTotal();
  await cart.save();
  res.json({ success: true, data: cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  cart.calculateTotal();
  await cart.save();
  res.json({ success: true, data: cart });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
