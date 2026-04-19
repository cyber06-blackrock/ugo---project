// Generates realistic mock drivers near a given location
// Used as a fallback when the backend API is unavailable (e.g., Vercel-only deployment)

const DRIVER_NAMES = [
  'Rajesh Kumar', 'Amit Singh', 'Priya Sharma', 'Mohammed Farooq',
  'Vikram Rathore', 'Sunita Devi', 'Deepak Meena', 'Arjun Patel',
  'Kavita Joshi', 'Rahul Verma', 'Nitin Agarwal', 'Pooja Gupta',
  'Suresh Yadav', 'Ananya Reddy', 'Manoj Tiwari', 'Riya Kapoor',
  'Ajay Chauhan', 'Neha Saxena', 'Karan Malhotra', 'Divya Nair'
];

const VEHICLES = [
  { type: 'UgoX', name: 'Maruti Suzuki Swift Dzire', icon: '🚗' },
  { type: 'UgoX', name: 'Hyundai i20', icon: '🚗' },
  { type: 'UgoX', name: 'Honda City', icon: '🚗' },
  { type: 'UgoX', name: 'Tata Nexon', icon: '🚗' },
  { type: 'UgoX', name: 'Kia Sonet', icon: '🚗' },
  { type: 'UgoX', name: 'Maruti Suzuki Baleno', icon: '🚗' },
  { type: 'UgoXL', name: 'Mahindra XUV700', icon: '🚙' },
  { type: 'UgoXL', name: 'Toyota Fortuner', icon: '🚙' },
  { type: 'UgoBlack', name: 'Toyota Innova Crysta', icon: '🖤' },
  { type: 'UgoBlack', name: 'Mercedes-Benz E-Class', icon: '🖤' },
  { type: 'UgoBlack', name: 'BMW 5 Series', icon: '🖤' },
  { type: 'UgoAuto', name: 'Bajaj RE Auto', icon: '🛺' },
  { type: 'UgoAuto', name: 'Piaggio Ape', icon: '🛺' },
  { type: 'UgoMoto', name: 'Royal Enfield Classic 350', icon: '🏍️' },
  { type: 'UgoMoto', name: 'Honda Activa 6G', icon: '🏍️' },
];

const PLATES_PREFIX = ['RJ 14', 'DL 01', 'MH 02', 'KA 05', 'UP 16', 'TN 09', 'HR 26', 'GJ 01'];
const PLATE_SUFFIX = ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST'];

// Seeded random for consistency per session
let seed = Date.now() % 10000;
const seededRandom = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

/**
 * Generate mock drivers near the user's location
 * @param {number} lat - User latitude
 * @param {number} lng - User longitude
 * @param {number} count - Number of drivers to generate (default 12)
 * @returns {Array} Array of driver objects
 */
export const generateNearbyDrivers = (lat, lng, count = 12) => {
  const drivers = [];

  for (let i = 0; i < count; i++) {
    // Random offset: spread drivers within ~0.3 to ~2.5 km for 1-5 min ETAs
    const angle = seededRandom() * Math.PI * 2;
    // Ensure the first few drivers are specifically 1, 2, 3 mins away and SEPARATED by direction
    let radiusKm;
    let customAngle = angle;
    if (i === 0) { 
        radiusKm = 0.45; // ~1 min
        customAngle = 0; // East
    } else if (i === 1) { 
        radiusKm = 0.95; // ~2 min
        customAngle = Math.PI * 0.75; // North-West
    } else if (i === 2) { 
        radiusKm = 1.45; // ~3 min
        customAngle = Math.PI * 1.5; // South
    } else {
        radiusKm = 2.0 + seededRandom() * 4.0; 
    }
    
    // ~0.009 degrees ≈ 1 km
    const latOffset = Math.cos(customAngle) * radiusKm * 0.009;
    const lngOffset = Math.sin(customAngle) * radiusKm * 0.009;

    const vehicle = VEHICLES[Math.floor(seededRandom() * VEHICLES.length)];
    const driverName = DRIVER_NAMES[i % DRIVER_NAMES.length];
    const platePrefix = PLATES_PREFIX[Math.floor(seededRandom() * PLATES_PREFIX.length)];
    const plateSuffix = PLATE_SUFFIX[Math.floor(seededRandom() * PLATE_SUFFIX.length)];
    const plateNum = String(Math.floor(1000 + seededRandom() * 9000));

    const distance = parseFloat(radiusKm.toFixed(2));
    const eta = Math.max(1, Math.round((distance / 30) * 60)); // ~30km/h city speed

    drivers.push({
      _id: `local-driver-${i}-${Date.now()}`,
      name: driverName,
      vehicleType: vehicle.type,
      vehicleName: vehicle.name,
      licensePlate: `${platePrefix} ${plateSuffix} ${plateNum}`,
      rating: parseFloat((4.3 + seededRandom() * 0.7).toFixed(2)),
      totalRides: Math.floor(200 + seededRandom() * 8000),
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(driverName)}`,
      isAvailable: true,
      location: {
        lat: lat + latOffset,
        lng: lng + lngOffset
      },
      distance,
      eta
    });
  }

  // Sort by distance (nearest first)
  drivers.sort((a, b) => a.distance - b.distance);

  return drivers;
};

export default generateNearbyDrivers;
