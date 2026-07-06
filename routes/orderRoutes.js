const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById, cancelOrder,
  getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Admin routes FIRST (before /:id to avoid param conflicts)
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// User routes
router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
