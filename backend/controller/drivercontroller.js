const User = require('../Models/user');

// @desc    Update driver location
// @route   PUT /api/drivers/location
// @access  Private (Driver only)
const updateLocation = async (req, res) => {
  const { lat, lng } = req.body;

  try {
    // Assuming req.user is populated by an auth middleware
    const driver = await User.findById(req.user._id);

    if (driver && driver.role === 'driver') {
      driver.location = { lat, lng };
      const updatedDriver = await driver.save();
      res.json({
        _id: updatedDriver._id,
        name: updatedDriver.name,
        location: updatedDriver.location
      });
    } else {
      res.status(404).json({ message: 'Driver not found or invalid role' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle driver availability
// @route   PUT /api/drivers/status
// @access  Private (Driver only)
const toggleAvailability = async (req, res) => {
  const { isAvailable } = req.body;
  const { mockDb, isUsingMockDb } = require('../config/db');

  try {
    // Mock database support
    if (isUsingMockDb && isUsingMockDb()) {
      const driver = await mockDb.findUserById(req.user._id);
      
      if (driver && driver.role === 'driver') {
        driver.isAvailable = isAvailable !== undefined ? isAvailable : !driver.isAvailable;
        mockDb.users[req.user._id] = driver; // Update in mock DB
        
        console.log(`📊 Driver ${driver.name} is now ${driver.isAvailable ? 'ONLINE' : 'OFFLINE'}`);
        
        return res.json({
          _id: driver._id,
          name: driver.name,
          isAvailable: driver.isAvailable
        });
      } else {
        return res.status(404).json({ message: 'Driver not found or invalid role' });
      }
    }

    // MongoDB support
    const driver = await User.findById(req.user._id);

    if (driver && driver.role === 'driver') {
      driver.isAvailable = isAvailable !== undefined ? isAvailable : !driver.isAvailable;
      const updatedDriver = await driver.save();
      
      console.log(`📊 Driver ${updatedDriver.name} is now ${updatedDriver.isAvailable ? 'ONLINE' : 'OFFLINE'}`);
      
      res.json({
        _id: updatedDriver._id,
        name: updatedDriver.name,
        isAvailable: updatedDriver.isAvailable
      });
    } else {
      res.status(404).json({ message: 'Driver not found or invalid role' });
    }
  } catch (error) {
    console.error('Toggle availability error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Haversine formula to calculate distance between two coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// @desc    Get all available drivers near a location
// @route   GET /api/drivers/available
// @access  Public (no auth needed — so users can see drivers on the map before logging in)
const getAvailableDrivers = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const maxRadius = parseFloat(radius) || 15; // default 15 km radius

    // Fetch all available drivers from DB with driver-specific fields
    const realDrivers = await User.find({ role: 'driver', isAvailable: true })
      .select('name location isAvailable vehicleType vehicleName licensePlate rating totalRides profilePhoto')
      .lean();

    let drivers = realDrivers;

    // If rider provides location, calculate distance + ETA and filter by radius
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      drivers = realDrivers
        .map((driver) => {
          if (!driver.location?.lat || !driver.location?.lng) return null;

          const distance = haversineDistance(
            userLat,
            userLng,
            driver.location.lat,
            driver.location.lng
          );

          // Estimated arrival time: assume avg 30 km/h in city traffic
          const etaMinutes = Math.max(1, Math.round((distance / 30) * 60));

          return {
            ...driver,
            distance: parseFloat(distance.toFixed(2)),
            eta: etaMinutes
          };
        })
        .filter((d) => d !== null && d.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance); // nearest first
    }

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single driver's profile
// @route   GET /api/drivers/:id
// @access  Public
const getDriverProfile = async (req, res) => {
  try {
    const driver = await User.findById(req.params.id)
      .select('name location isAvailable vehicleType vehicleName licensePlate rating totalRides profilePhoto');

    if (!driver || driver.role === 'rider') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateLocation, toggleAvailability, getAvailableDrivers, getDriverProfile };