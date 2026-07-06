const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, changePassword,
  addAddress, updateAddress, deleteAddress,
  getAllUsers, getUserById, deleteUser, toggleBlockUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ──────────────────────────────────────────────────────
// Specific named routes MUST come before /:id patterns
// ──────────────────────────────────────────────────────

// User profile routes (own user)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

// User address routes
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Admin user management (generic /:id routes — must be LAST)
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);
router.put('/:id/block', protect, adminOnly, toggleBlockUser);

module.exports = router;
