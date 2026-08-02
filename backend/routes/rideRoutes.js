const express = require('express');
const router = express.Router();
const { requestRide, getActiveRides, getUserRideHistory, getQuote, acceptRide, cancelRide } = require('../controller/ridecontroller');

router.post('/request', requestRide);
router.get('/active', getActiveRides);
router.get('/history/:userId', getUserRideHistory);
router.get('/quote', getQuote);
router.put('/:id/accept', acceptRide);
router.post('/:id/cancel', cancelRide);

module.exports = router;
