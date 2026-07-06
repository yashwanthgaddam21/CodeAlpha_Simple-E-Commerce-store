const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json({ success: true, data: categories });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, data: category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const slug = slugify(name, { lower: true, strict: true });
  let image = '';
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  const category = await Category.create({ name, slug, description, image });
  res.status(201).json({ success: true, data: category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) category.description = description;
  if (req.file) category.image = `/uploads/${req.file.filename}`;

  const updated = await category.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category with ${productCount} associated products`);
  }

  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted successfully' });
});

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
