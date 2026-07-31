/**
 * Mock Database Module
 * In-memory storage for development/testing
 * Can be swapped out for real MongoDB when configured
 */

const mockUsers = {};
let userIdCounter = 1;

const mockDb = {
  // Store user by ID
  users: {},

  // User operations
  createUser: async (userData) => {
    const id = String(userIdCounter++);
    const user = {
      _id: id,
      ...userData,
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

  // Utility
  clear: () => {
    mockDb.users = {};
    userIdCounter = 1;
  },
};

console.log('📦 Using in-memory mock database for development');

module.exports = mockDb;
