const express = require('express');
const router = express.Router();
const { requestRide, getActiveRides } = require('../controller/rideController');

router.post('/request', requestRide);
router.get('/active', getActiveRides);

module.exports = router;
