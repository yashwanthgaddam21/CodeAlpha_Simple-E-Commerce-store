const express = require('express');
const router = express.Router();
const {
  getProducts, getFeaturedProducts, getProductBySlug,
  getProductById, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/id/:id', protect, adminOnly, getProductById);
router.get('/:slug', getProductBySlug);

router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
