const Ride = require('../Models/ride');
const { isUsingMockDb } = require('../config/db');
const mockDb = require('../config/mockDb');

// ── Haversine formula ────────────────────────────────────────────────────────
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Geocode a place name to {lat, lng} via Nominatim ───────────────────────
const geocode = async (place) => {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?format=json&q=${encodeURIComponent(place)}&limit=1&countrycodes=in`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'UgoRideApp/1.0 (contact@ugo.app)' },
  });
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
};

// ── Fare rates per km ────────────────────────────────────────────────────────
// Base: ₹30 / km for UgoX. Other tiers scale from this.
const RATES = {
  UgoGo:    20,   // budget compact
  UgoX:     30,   // everyday ← the stated base rate
  UgoXL:    48,   // SUV / extra seats
  UgoBlack: 72,   // luxury
  UgoMoto:  12,   // bike
  UgoAuto:  16,   // auto-rickshaw
};

// Base fares (flag-fall) per type
const BASE_FARE = {
  UgoGo:    20,
  UgoX:     30,
  UgoXL:    50,
  UgoBlack: 80,
  UgoMoto:  10,
  UgoAuto:  15,
};

const RIDE_INFO = {
  UgoGo:    { info: 'Most affordable · compact car',   icon: '🚗' },
  UgoX:     { info: 'Everyday ride · comfortable sedan', icon: '🚗' },
  UgoXL:    { info: 'Spacious SUV · up to 6 seats',    icon: '🚙' },
  UgoBlack: { info: 'Premium luxury car',               icon: '🖤' },
  UgoMoto:  { info: 'Bike ride · beat the traffic',     icon: '🏍️' },
  UgoAuto:  { info: 'Auto-rickshaw · city hop',         icon: '🛺' },
};

// Average city speed assumptions (km/h) per type
const SPEED = {
  UgoGo:    28,
  UgoX:     28,
  UgoXL:    25,
  UgoBlack: 30,
  UgoMoto:  35,
  UgoAuto:  22,
};

const formatDuration = (minutes) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
};

// ── GET /api/rides/quote ─────────────────────────────────────────────────────
const getQuote = async (req, res) => {
  const { pickup, dropoff } = req.query;

  if (!pickup || !dropoff) {
    return res.status(400).json({ message: 'Pickup and Dropoff are required.' });
  }

  try {
    // 1. Geocode both locations (bias towards Jaipur / India)
    const [fromCoord, toCoord] = await Promise.all([
      geocode(pickup + ', Jaipur'),
      geocode(dropoff + ', Jaipur'),
    ]);

    let distanceKm;
    let pickupCoords  = { lat: 26.9124, lng: 75.7873 };
    let dropoffCoords = { lat: 26.9224, lng: 75.7973 };

    if (fromCoord && toCoord) {
      distanceKm    = haversineKm(fromCoord.lat, fromCoord.lng, toCoord.lat, toCoord.lng);
      pickupCoords  = fromCoord;
      dropoffCoords = toCoord;
    } else {
      // Fallback: character-diff heuristic keeps something reasonable
      distanceKm = Math.max(1, Math.abs(pickup.length - dropoff.length) + 3);
    }

    // Minimum 1 km so we never quote ₹0
    distanceKm = Math.max(1, distanceKm);

    // 2. Build quotes for every ride type
    const quotes = Object.keys(RATES).map((type) => {
      const fare      = BASE_FARE[type] + Math.round(distanceKm * RATES[type]);
      const durationM = (distanceKm / SPEED[type]) * 60;
      return {
        type,
        icon:     RIDE_INFO[type].icon,
        info:     RIDE_INFO[type].info,
        price:    fare,
        distance: distanceKm.toFixed(1),
        duration: formatDuration(durationM),
        durationMins: Math.round(durationM),
      };
    });

    res.json({
      quotes,
      distance:     distanceKm.toFixed(1),
      pickupCoords,
      dropoffCoords,
    });
  } catch (error) {
    console.error('Quote error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/rides/request ──────────────────────────────────────────────────
const requestRide = async (req, res) => {
  const { riderId, pickup, dropoff, fare, distance, pickupCoords, dropoffCoords } = req.body;

  try {
    let newRide;
    
    // Use mock database if MongoDB is not available
    if (isUsingMockDb()) {
      newRide = await mockDb.createRide({
        rider: riderId,
        pickupLocation: {
          address: pickup,
          lat: pickupCoords?.lat  ?? 26.9124 + Math.random() * 0.01,
          lng: pickupCoords?.lng  ?? 75.7873 + Math.random() * 0.01,
        },
        dropoffLocation: {
          address: dropoff,
          lat: dropoffCoords?.lat ?? 26.9224 + Math.random() * 0.01,
          lng: dropoffCoords?.lng ?? 75.7973 + Math.random() * 0.01,
        },
        fare:     fare     || 0,
        distance: distance || '0 km',
        status:   'requested',
      });
    } else {
      newRide = await Ride.create({
        rider: riderId,
        pickupLocation: {
          address: pickup,
          lat: pickupCoords?.lat  ?? 26.9124 + Math.random() * 0.01,
          lng: pickupCoords?.lng  ?? 75.7873 + Math.random() * 0.01,
        },
        dropoffLocation: {
          address: dropoff,
          lat: dropoffCoords?.lat ?? 26.9224 + Math.random() * 0.01,
          lng: dropoffCoords?.lng ?? 75.7973 + Math.random() * 0.01,
        },
        fare:     fare     || 0,
        distance: distance || '0 km',
        status:   'requested',
      });
    }

    // Emit ride request to all online drivers via Socket.IO
    if (req.app.get('io')) {
      req.app.get('io').emit('rideRequest', {
        _id: newRide._id,
        pickup: pickup,
        dropoff: dropoff,
        fare: fare,
        distance: distance,
        pickupCoords: newRide.pickupLocation,
        dropoffCoords: newRide.dropoffLocation,
        riderId: riderId,
        status: 'requested'
      });
      console.log('🚗 Ride request broadcast to drivers:', newRide._id);
    }

    res.status(201).json(newRide);
  } catch (error) {
    console.error('❌ Ride request error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/rides/active ────────────────────────────────────────────────────
const getActiveRides = async (req, res) => {
  try {
    let rides;
    
    // Use mock database if MongoDB is not available
    if (isUsingMockDb()) {
      rides = await mockDb.findRides({ status: 'requested' });
    } else {
      rides = await Ride.find({ status: 'requested' }).populate('rider', 'name');
    }
    
    console.log('📋 Active rides found:', rides.length);
    res.json(rides);
  } catch (error) {
    console.error('❌ Get active rides error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/rides/history/:userId ───────────────────────────────────────────
const getUserRideHistory = async (req, res) => {
  try {
    let rides;
    
    // Use mock database if MongoDB is not available
    if (isUsingMockDb()) {
      rides = await mockDb.findRides({ rider: req.params.userId });
      rides = rides.slice(0, 10).reverse(); // Get last 10
    } else {
      rides = await Ride.find({ rider: req.params.userId })
        .select('pickupLocation.address dropoffLocation.address')
        .sort({ createdAt: -1 })
        .limit(10);
    }
    
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/rides/:id/accept ────────────────────────────────────────────────
const acceptRide = async (req, res) => {
  try {
    let ride;
    
    // Use mock database if MongoDB is not available
    if (isUsingMockDb()) {
      ride = await mockDb.findRideById(req.params.id);
      if (!ride) return res.status(404).json({ message: 'Ride not found' });
      if (ride.status !== 'requested') {
        return res.status(400).json({ message: 'Ride is no longer available' });
      }
      ride = await mockDb.updateRide(req.params.id, {
        status: 'accepted',
        driver: req.user?._id || null,
      });
    } else {
      ride = await Ride.findById(req.params.id);
      if (!ride) return res.status(404).json({ message: 'Ride not found' });
      if (ride.status !== 'requested') {
        return res.status(400).json({ message: 'Ride is no longer available' });
      }
      ride.status = 'accepted';
      ride.driver = req.user?._id || null;
      await ride.save();
    }
    
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/rides/:id/cancel ──────────────────────────────────────────────
const cancelRide = async (req, res) => {
  try {
    const { reason, cancellationFee } = req.body;
    let ride;
    
    // Use mock database if MongoDB is not available
    if (isUsingMockDb()) {
      ride = await mockDb.findRideById(req.params.id);
      if (!ride) return res.status(404).json({ message: 'Ride not found' });
      
      ride = await mockDb.updateRide(req.params.id, {
        status: 'cancelled',
        cancellationReason: reason || 'user_request',
        cancellationFee: cancellationFee || 0,
      });
    } else {
      ride = await Ride.findById(req.params.id);
      if (!ride) return res.status(404).json({ message: 'Ride not found' });
      
      ride.status = 'cancelled';
      ride.cancellationReason = reason || 'user_request';
      ride.cancellationFee = cancellationFee || 0;
      await ride.save();
    }
    
    // Emit cancellation to driver via Socket.IO
    if (req.app.get('io')) {
      req.app.get('io').emit('rideCancelled', {
        rideId: req.params.id,
        reason: reason,
        cancellationFee: cancellationFee,
      });
      console.log('❌ Ride cancelled, notifying drivers:', req.params.id);
    }
    
    res.json({ message: 'Ride cancelled successfully', ride, cancellationFee });
  } catch (error) {
    console.error('❌ Cancel ride error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requestRide, getActiveRides, getUserRideHistory, getQuote, acceptRide, cancelRide };
