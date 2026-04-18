const express = require('express');
const router = express.Router();
const { updateLocation, toggleAvailability, getAvailableDrivers, getDriverProfile } = require('../controller/drivercontroller');
const { protect } = require('../middleware/authMiddleware');

// Public routes — no auth needed so users see drivers before logging in
router.get('/available', getAvailableDrivers);
router.get('/:id', getDriverProfile);

// Protected routes — driver must be logged in
router.put('/location', protect, updateLocation);
router.put('/status', protect, toggleAvailability);

module.exports = router;
