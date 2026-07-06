const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    // Give a descriptive error for expired vs invalid tokens
    if (err.name === 'TokenExpiredError') {
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error('Not authorized, invalid token');
  }

  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('User account no longer exists');
  }

  if (req.user.isBlocked) {
    res.status(403);
    throw new Error('Your account has been blocked. Please contact support.');
  }

  next();
});

module.exports = { protect };
