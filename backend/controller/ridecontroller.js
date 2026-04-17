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
    const calculatedFare = mockDistance * 2.5; // $2.5 per 'mile'

    const newRide = await Ride.create({
      rider: riderId,
      pickupLocation: {
        address: pickup,
        lat: 37.7749 + (Math.random() * 0.01), // mock coordinates
        lng: -122.4194 + (Math.random() * 0.01)
      },
      dropoffLocation: {
        address: dropoff,
        lat: 37.7849 + (Math.random() * 0.01),
        lng: -122.4094 + (Math.random() * 0.01)
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

module.exports = { requestRide, getActiveRides };
