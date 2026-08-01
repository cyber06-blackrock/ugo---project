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
      console.log('🔐 Token decoded:', { id: decoded.id });

      // Use mock database if MongoDB not available
      if (isUsingMockDb && isUsingMockDb()) {
        console.log('🗄️ Auth: Using mock database');
        const user = await mockDb.findUserById(decoded.id);
        console.log('👤 Auth: Found user:', user ? `${user.name} (${user.role})` : 'null');
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
      } else {
        console.log('🗄️ Auth: Using MongoDB');
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      }

      next();
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('❌ No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
