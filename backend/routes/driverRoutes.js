const express = require('express');
const router = express.Router();
const { updateLocation, toggleAvailability, getAvailableDrivers } = require('../controller/drivercontroller');
const { protect } = require('../middleware/authMiddleware');

router.put('/location', protect, updateLocation);
router.put('/status', protect, toggleAvailability);
router.get('/available', protect, getAvailableDrivers);

module.exports = router;
