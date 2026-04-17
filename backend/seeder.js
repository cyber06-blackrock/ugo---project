const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./Models/user');
const Ride = require('./Models/ride');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Ride.deleteMany();

    const users = [
      {
        name: 'John Doe (Rider)',
        email: 'john@example.com',
        password: 'password123',
        role: 'rider',
      },
      {
        name: 'Jane Smith (Driver)',
        email: 'jane@example.com',
        password: 'password123',
        role: 'driver',
        isAvailable: true,
        location: { lat: 37.7749, lng: -122.4194 }
      },
      {
        name: 'Bob Johnson (Rider)',
        email: 'bob@example.com',
        password: 'password123',
        role: 'rider',
      }
    ];

    // Insert dummy users
    const createdUsers = await User.insertMany(users);

    const rider1 = createdUsers[0]._id;
    const driver1 = createdUsers[1]._id;

    const dummyRides = [
      {
        rider: rider1,
        driver: driver1,
        pickupLocation: {
          lat: 37.7749,
          lng: -122.4194,
          address: '123 Main St, San Francisco, CA'
        },
        dropoffLocation: {
          lat: 37.7849,
          lng: -122.4094,
          address: '456 Market St, San Francisco, CA'
        },
        status: 'completed',
        fare: 25.50
      },
      {
        rider: rider1,
        pickupLocation: {
          lat: 37.7750,
          lng: -122.4200,
          address: '789 Oak St, San Francisco, CA'
        },
        dropoffLocation: {
          lat: 37.7900,
          lng: -122.4000,
          address: '101 Pine St, San Francisco, CA'
        },
        status: 'requested',
        fare: 15.00
      }
    ];

    // Insert dummy rides
    await Ride.insertMany(dummyRides);

    console.log('Sample Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Ride.deleteMany();

    console.log('Sample Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
