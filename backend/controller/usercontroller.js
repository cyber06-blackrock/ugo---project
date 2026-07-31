const User = require('../Models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// ── Validation helpers ────────────────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // ── Field presence ──
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  // ── Name ──
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters.' });
  }
  if (trimmedName.length > 50) {
    return res.status(400).json({ message: 'Name must be 50 characters or fewer.' });
  }

  // ── Email ──
  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  // ── Password ──
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  if (password.length > 100) {
    return res.status(400).json({ message: 'Password is too long.' });
  }

  // ── Role ──
  const allowedRoles = ['rider', 'driver'];
  const userRole = role && allowedRoles.includes(role) ? role : 'rider';

  try {
    const userExists = await User.findOne({ email: email.trim().toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: trimmedName,
      email: email.trim().toLowerCase(),
      password,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  // ── Field presence ──
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // ── Email format ──
  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  // ── Password length sanity ──
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser };
