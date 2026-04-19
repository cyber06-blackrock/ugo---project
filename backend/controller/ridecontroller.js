const Ride = require('../Models/ride');

// @desc    Get fare quotes for different ride types
// @route   GET /api/rides/quote
const getQuote = async (req, res) => {
  const { pickup, dropoff } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!pickup || !dropoff) {
    return res.status(400).json({ message: "Pickup and Dropoff locations are required" });
  }

  try {
    let distanceInKm = 0;
    let durationText = "";

    // Attempt to use Google Maps Distance Matrix API
    if (apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.rows && data.rows[0].elements[0].status === 'OK') {
          const element = data.rows[0].elements[0];
          distanceInKm = element.distance.value / 1000;
          durationText = element.duration.text;
        } else {
          throw new Error("Google Maps API returned no results");
        }
      } catch (apiError) {
        console.warn("Google Maps API failed, falling back to mock:", apiError.message);
        distanceInKm = Math.abs(pickup.length - dropoff.length) + 5;
        durationText = `${Math.round(distanceInKm * 1.5)} mins`;
      }
    } else {
      // Mock calculation if no API key
      distanceInKm = Math.abs(pickup.length - dropoff.length) + 5;
      durationText = `${Math.round(distanceInKm * 1.5)} mins`;
    }

    const rates = {
      ugoGo: 12,    // Super Affordable
      ugoX: 20,     // Everyday
      ugoXL: 35,    // Premium
      ugoBlack: 55  // Luxury
    };

    const quotes = [
      { 
        type: 'UgoGo', 
        price: Math.round(distanceInKm * rates.ugoGo), 
        info: 'Most affordable, compact cars', 
        distance: distanceInKm.toFixed(1), 
        duration: durationText 
      },
      { 
        type: 'UgoX', 
        price: Math.round(distanceInKm * rates.ugoX), 
        info: 'Everyday rides, comfortable sedans', 
        distance: distanceInKm.toFixed(1), 
        duration: durationText 
      },
      { 
        type: 'UgoXL', 
        price: Math.round(distanceInKm * rates.ugoXL), 
        info: 'Spacious SUVs for large groups', 
        distance: distanceInKm.toFixed(1), 
        duration: durationText 
      },
      { 
        type: 'UgoBlack', 
        price: Math.round(distanceInKm * rates.ugoBlack), 
        info: 'Premium experience in luxury cars', 
        distance: distanceInKm.toFixed(1), 
        duration: durationText 
      }
    ];

    res.json({ quotes, distance: distanceInKm.toFixed(1), duration: durationText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a ride request
// @route   POST /api/rides/request
const requestRide = async (req, res) => {
  const { riderId, pickup, dropoff, fare, distance } = req.body;

  try {
    const newRide = await Ride.create({
      rider: riderId,
      pickupLocation: {
        address: pickup,
        lat: 26.9124 + (Math.random() * 0.01), 
        lng: 75.7873 + (Math.random() * 0.01)
      },
      dropoffLocation: {
        address: dropoff,
        lat: 26.9224 + (Math.random() * 0.01),
        lng: 75.7973 + (Math.random() * 0.01)
      },
      fare: fare || 0,
      distance: distance || "0 km",
      status: 'requested'
    });

    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active ride requests
const getActiveRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' }).populate('rider', 'name');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past ride locations
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

module.exports = { requestRide, getActiveRides, getUserRideHistory, getQuote };
