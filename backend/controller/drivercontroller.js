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

  try {
    const driver = await User.findById(req.user._id);

    if (driver && driver.role === 'driver') {
      driver.isAvailable = isAvailable !== undefined ? isAvailable : !driver.isAvailable;
      const updatedDriver = await driver.save();
      res.json({
        _id: updatedDriver._id,
        name: updatedDriver.name,
        isAvailable: updatedDriver.isAvailable
      });
    } else {
      res.status(404).json({ message: 'Driver not found or invalid role' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available drivers
// @route   GET /api/drivers/available
// @access  Private
const getAvailableDrivers = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    // Fetch real available drivers from DB
    const realDrivers = await User.find({ role: 'driver', isAvailable: true }).select('-password');
    
    let availableDrivers = [...realDrivers];

    // If rider provides location, generate 5 simulated drivers nearby
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      
      const mockDrivers = Array.from({ length: 5 }).map((_, i) => {
        // Random offset between -0.015 and 0.015 degrees (approx 1.5km radius)
        const latOffset = (Math.random() - 0.5) * 0.03;
        const lngOffset = (Math.random() - 0.5) * 0.03;
        return {
          _id: `mock-driver-${i}`,
          name: `Ugo Driver ${i + 1}`,
          role: 'driver',
          location: {
            lat: userLat + latOffset,
            lng: userLng + lngOffset
          }
        };
      });
      
      availableDrivers = [...availableDrivers, ...mockDrivers];
    }

    res.json(availableDrivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateLocation, toggleAvailability, getAvailableDrivers };