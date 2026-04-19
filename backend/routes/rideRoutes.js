const express = require('express');
const router = express.Router();
const { requestRide, getActiveRides, getUserRideHistory, getQuote } = require('../controller/ridecontroller');

router.post('/request', requestRide);
router.get('/active', getActiveRides);
router.get('/history/:userId', getUserRideHistory);
router.get('/quote', getQuote);

module.exports = router;
