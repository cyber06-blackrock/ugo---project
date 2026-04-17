const express = require('express');
const router = express.Router();
const { requestRide, getActiveRides, getUserRideHistory } = require('../controller/ridecontroller');

router.post('/request', requestRide);
router.get('/active', getActiveRides);
router.get('/history/:userId', getUserRideHistory);

module.exports = router;
