const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/Product');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const baseQuery = Product.find({ isActive: true }).populate('category', 'name slug');

  const features = new ApiFeatures(baseQuery, req.query)
    .search()
    .filter()
    .sort()
    .paginate(12);

  const products = await features.query;
  const total = await Product.countDocuments({ isActive: true });

  res.json({
    success: true,
    total,
    page: features.page,
    pages: Math.ceil(total / features.limit),
    data: products,
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .limit(8)
    .sort('-createdAt');
  res.json({ success: true, data: products });
});

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' },
      options: { sort: { createdAt: -1 } },
    });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Related products
  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .select('name slug images price discountPrice discountPercentage ratings numReviews brand');

  res.json({ success: true, data: product, related });
});

// @desc    Get product by ID (admin)
// @route   GET /api/products/id/:id
// @access  Admin
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, price, discountPercentage, category,
    brand, stock, specifications, isFeatured,
  } = req.body;

  const slug = slugify(name, { lower: true, strict: true });
  const existing = await Product.findOne({ slug });
  if (existing) {
    res.status(400);
    throw new Error('A product with this name already exists');
  }

  const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

  const product = await Product.create({
    name, slug, description, price: parseFloat(price),
    discountPercentage: parseFloat(discountPercentage) || 0,
    category, brand, stock: parseInt(stock),
    images,
    specifications: specifications ? JSON.parse(specifications) : [],
    isFeatured: isFeatured === 'true',
  });

  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, description, price, discountPercentage, category, brand, stock, specifications, isFeatured, isActive } = req.body;

  if (name && name !== product.name) {
    product.name = name;
    product.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = parseFloat(price);
  if (discountPercentage !== undefined) product.discountPercentage = parseFloat(discountPercentage);
  if (category !== undefined) product.category = category;
  if (brand !== undefined) product.brand = brand;
  if (stock !== undefined) product.stock = parseInt(stock);
  if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
  if (specifications !== undefined) {
    product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
  }

  // Append new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => `/uploads/${f.filename}`);
    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

module.exports = {
  getProducts, getFeaturedProducts, getProductBySlug,
  getProductById, createProduct, updateProduct, deleteProduct,
};
