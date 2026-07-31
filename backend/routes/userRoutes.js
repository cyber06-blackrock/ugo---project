const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, getAllUsers } = require('../controller/usercontroller');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/all', protect, getAllUsers);  // Protected route to get all users

module.exports = router;
