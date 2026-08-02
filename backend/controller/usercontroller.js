const User = require('../Models/user');
const jwt  = require('jsonwebtoken');

// ── Helpers ────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/\D/g, ''));

// ── @route   POST /api/users/register ──────────────────────────────────────
// Supports two modes:
//   1. Quick signup  → name + phone  (OTP-verified, no password)
//   2. Email signup  → name + email + password
const registerUser = async (req, res) => {
  const { name, email, phone, password, role, quickSignup, profilePhoto } = req.body;

  // ── Name required always ──
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 2)  return res.status(400).json({ message: 'Name must be at least 2 characters.' });
  if (trimmedName.length > 50) return res.status(400).json({ message: 'Name must be 50 characters or fewer.' });

  // ── At least email OR phone must be provided ──
  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone number is required.' });
  }

  // ── Validate email if provided ──
  if (email && !isValidEmail(email.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  // ── Validate phone if provided ──
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ message: 'Please enter a valid 10-digit phone number.' });
  }

  // ── Password required for email signup (not quickSignup) ──
  if (!quickSignup && email) {
    if (!password)          return res.status(400).json({ message: 'Password is required.' });
    if (password.length < 6)  return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (password.length > 100) return res.status(400).json({ message: 'Password is too long.' });
  }

  const userRole = ['rider', 'driver'].includes(role) ? role : 'rider';

  try {
    // ── Duplicate check - MongoDB ──
    if (email) {
      const exists = await User.findOne({ email: email.trim().toLowerCase() });
      if (exists) return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    if (phone) {
      const cleaned = phone.replace(/\D/g, '');
      const exists  = await User.findOne({ phone: cleaned });
      if (exists) return res.status(400).json({ message: 'An account with this phone number already exists.' });
    }

    // ── Create user - MongoDB ──
    const userData = {
      name: trimmedName,
      role: userRole,
      profilePhoto: profilePhoto || '',
    };
    if (email)    userData.email    = email.trim().toLowerCase();
    if (phone)    userData.phone    = phone.replace(/\D/g, '');
    if (password) userData.password = password;   // hashed by pre-save hook

    const user = await User.create(userData);

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email  || null,
      phone: user.phone  || null,
      role:  user.role,
      profilePhoto: user.profilePhoto || '',
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── @route   POST /api/users/login ─────────────────────────────────────────
// Supports email+password login
const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        phone: user.phone || null,
        role:  user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── @route   GET /api/users/profile ────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ── @route   GET /api/users/all ────────────────────────────────────────────
// Get all registered users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📊 Fetched ${users.length} users from MongoDB`);

    res.json({
      total: users.length,
      users: users,
      source: 'mongodb'
    });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = { registerUser, authUser, getUserProfile, getAllUsers };
