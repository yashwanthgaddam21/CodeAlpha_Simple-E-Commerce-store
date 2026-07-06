const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Review.countDocuments({ product: req.params.productId });
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: reviews });
});

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existingReview = await Review.findOne({ user: req.user._id, product: productId });
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    title,
    comment,
  });

  const populated = await Review.findById(review._id).populate('user', 'name avatar');
  res.status(201).json({ success: true, data: populated });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied');
  }

  await review.deleteOne();
  // Recalculate ratings
  await Review.calcAverageRatings(review.product);
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { getProductReviews, addReview, deleteReview };
