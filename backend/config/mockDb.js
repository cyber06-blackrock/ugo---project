/**
 * Mock Database Module
 * In-memory storage for development/testing
 * Can be swapped out for real MongoDB when configured
 */

const mockUsers = {};
const mockRides = {};
let userIdCounter = 1;
let rideIdCounter = 1;

const mockDb = {
  // Store user by ID
  users: {},
  // Store rides by ID
  rides: {},

  // User operations
  createUser: async (userData) => {
    const id = String(userIdCounter++);
    const user = {
      _id: id,
      ...userData,
      profilePhoto: userData.profilePhoto || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.users[id] = user;
    return user;
  },

  findUserByEmail: async (email) => {
    return Object.values(mockDb.users).find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
    );
  },

  findUserByPhone: async (phone) => {
    return Object.values(mockDb.users).find((u) => u.phone === phone);
  },

  findUserById: async (id) => {
    return mockDb.users[id];
  },

  getAllUsers: async () => {
    return Object.values(mockDb.users);
  },

  // Ride operations
  createRide: async (rideData) => {
    const id = String(rideIdCounter++);
    const ride = {
      _id: id,
      ...rideData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.rides[id] = ride;
    console.log('✅ Mock ride created:', id, ride.pickupLocation?.address, '→', ride.dropoffLocation?.address);
    return ride;
  },

  findRideById: async (id) => {
    return mockDb.rides[id];
  },

  findRides: async (query = {}) => {
    let rides = Object.values(mockDb.rides);
    
    // Filter by status
    if (query.status) {
      rides = rides.filter(r => r.status === query.status);
    }
    
    // Filter by rider
    if (query.rider) {
      rides = rides.filter(r => r.rider === query.rider);
    }
    
    // Filter by driver
    if (query.driver) {
      rides = rides.filter(r => r.driver === query.driver);
    }
    
    return rides;
  },

  updateRide: async (id, updates) => {
    if (!mockDb.rides[id]) return null;
    mockDb.rides[id] = {
      ...mockDb.rides[id],
      ...updates,
      updatedAt: new Date(),
    };
    console.log('✅ Mock ride updated:', id, updates);
    return mockDb.rides[id];
  },

  getAllRides: async () => {
    return Object.values(mockDb.rides);
  },

  // Utility
  clear: () => {
    mockDb.users = {};
    mockDb.rides = {};
    userIdCounter = 1;
    rideIdCounter = 1;
  },
};

console.log('📦 Using in-memory mock database for development');

module.exports = mockDb;
