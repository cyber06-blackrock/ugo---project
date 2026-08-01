const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const { mockDb, isUsingMockDb } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Use mock database if MongoDB not available
      if (isUsingMockDb && isUsingMockDb()) {
        const user = await mockDb.findUserById(decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
