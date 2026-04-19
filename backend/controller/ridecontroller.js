const Ride = require('../Models/ride');

// @desc    Calculate fare and create a ride request
// @route   POST /api/rides/request
// @access  Public (in reality, should be protected)
const requestRide = async (req, res) => {
  const { riderId, pickup, dropoff } = req.body;

  try {
    // In a real app, you would use Google Maps API to calculate distance/time
    // Here we generate a mock fare based on a static string length for demo purposes
    const mockDistance = Math.abs(pickup.length - dropoff.length) + 5; 
    const calculatedFare = mockDistance * 25; // ₹25 per km

    const newRide = await Ride.create({
      rider: riderId,
      pickupLocation: {
        address: pickup,
        lat: 26.9124 + (Math.random() * 0.01), // mock coordinates (Jaipur)
        lng: 75.7873 + (Math.random() * 0.01)
      },
      dropoffLocation: {
        address: dropoff,
        lat: 26.9224 + (Math.random() * 0.01),
        lng: 75.7973 + (Math.random() * 0.01)
      },
      fare: calculatedFare,
      status: 'requested'
    });

    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active ride requests (for drivers to see)
// @route   GET /api/rides/active
// @access  Public
const getActiveRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' }).populate('rider', 'name');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past ride locations
// @route   GET /api/rides/history/:userId
// @access  Public
const getUserRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ rider: req.params.userId })
                          .select('pickupLocation.address dropoffLocation.address')
                          .sort({ createdAt: -1 })
                          .limit(10);
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requestRide, getActiveRides, getUserRideHistory };
