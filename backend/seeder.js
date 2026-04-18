const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./Models/user');
const Ride = require('./Models/ride');

dotenv.config();

connectDB();

// 15 realistic drivers spread around a base location
// The seeder uses Jaipur (26.9124, 75.7873) as the center
const BASE_LAT = 26.9124;
const BASE_LNG = 75.7873;

const driverData = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoX',
    vehicleName: 'Maruti Suzuki Swift Dzire',
    licensePlate: 'RJ 14 AB 1234',
    rating: 4.85,
    totalRides: 2340,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    location: { lat: BASE_LAT + 0.005, lng: BASE_LNG - 0.003 }
  },
  {
    name: 'Amit Singh',
    email: 'amit.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoBlack',
    vehicleName: 'Toyota Innova Crysta',
    licensePlate: 'RJ 14 CD 5678',
    rating: 4.92,
    totalRides: 5100,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    location: { lat: BASE_LAT - 0.008, lng: BASE_LNG + 0.006 }
  },
  {
    name: 'Priya Sharma',
    email: 'priya.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoX',
    vehicleName: 'Hyundai i20',
    licensePlate: 'RJ 14 EF 9012',
    rating: 4.78,
    totalRides: 1560,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    location: { lat: BASE_LAT + 0.012, lng: BASE_LNG + 0.009 }
  },
  {
    name: 'Mohammed Farooq',
    email: 'farooq.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoXL',
    vehicleName: 'Mahindra XUV700',
    licensePlate: 'RJ 14 GH 3456',
    rating: 4.88,
    totalRides: 3200,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farooq',
    location: { lat: BASE_LAT - 0.004, lng: BASE_LNG - 0.010 }
  },
  {
    name: 'Vikram Rathore',
    email: 'vikram.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoMoto',
    vehicleName: 'Royal Enfield Classic 350',
    licensePlate: 'RJ 14 IJ 7890',
    rating: 4.70,
    totalRides: 980,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    location: { lat: BASE_LAT + 0.002, lng: BASE_LNG + 0.015 }
  },
  {
    name: 'Sunita Devi',
    email: 'sunita.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoX',
    vehicleName: 'Honda City',
    licensePlate: 'RJ 14 KL 2345',
    rating: 4.95,
    totalRides: 4500,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita',
    location: { lat: BASE_LAT - 0.011, lng: BASE_LNG + 0.002 }
  },
  {
    name: 'Deepak Meena',
    email: 'deepak.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoAuto',
    vehicleName: 'Bajaj RE Auto',
    licensePlate: 'RJ 14 MN 6789',
    rating: 4.60,
    totalRides: 7800,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak',
    location: { lat: BASE_LAT + 0.009, lng: BASE_LNG - 0.007 }
  },
  {
    name: 'Arjun Patel',
    email: 'arjun.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoBlack',
    vehicleName: 'Mercedes-Benz E-Class',
    licensePlate: 'RJ 14 OP 0123',
    rating: 4.97,
    totalRides: 1200,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    location: { lat: BASE_LAT - 0.006, lng: BASE_LNG - 0.014 }
  },
  {
    name: 'Kavita Joshi',
    email: 'kavita.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoX',
    vehicleName: 'Tata Nexon',
    licensePlate: 'RJ 14 QR 4567',
    rating: 4.82,
    totalRides: 2100,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita',
    location: { lat: BASE_LAT + 0.014, lng: BASE_LNG - 0.005 }
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoMoto',
    vehicleName: 'Honda Activa 6G',
    licensePlate: 'RJ 14 ST 8901',
    rating: 4.65,
    totalRides: 3400,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    location: { lat: BASE_LAT - 0.003, lng: BASE_LNG + 0.012 }
  },
  {
    name: 'Nitin Agarwal',
    email: 'nitin.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoXL',
    vehicleName: 'Toyota Fortuner',
    licensePlate: 'RJ 14 UV 2345',
    rating: 4.90,
    totalRides: 1800,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nitin',
    location: { lat: BASE_LAT + 0.007, lng: BASE_LNG + 0.004 }
  },
  {
    name: 'Pooja Gupta',
    email: 'pooja.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoX',
    vehicleName: 'Kia Sonet',
    licensePlate: 'RJ 14 WX 6789',
    rating: 4.75,
    totalRides: 900,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
    location: { lat: BASE_LAT - 0.010, lng: BASE_LNG - 0.008 }
  },
  {
    name: 'Suresh Yadav',
    email: 'suresh.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoAuto',
    vehicleName: 'Piaggio Ape',
    licensePlate: 'RJ 14 YZ 0123',
    rating: 4.55,
    totalRides: 6200,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
    location: { lat: BASE_LAT + 0.003, lng: BASE_LNG - 0.012 }
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoBlack',
    vehicleName: 'BMW 5 Series',
    licensePlate: 'RJ 14 AA 9876',
    rating: 4.98,
    totalRides: 800,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    location: { lat: BASE_LAT - 0.013, lng: BASE_LNG + 0.010 }
  },
  {
    name: 'Manoj Tiwari',
    email: 'manoj.driver@ugo.com',
    password: 'driver123',
    role: 'driver',
    isAvailable: true,
    vehicleType: 'UgoX',
    vehicleName: 'Maruti Suzuki Baleno',
    licensePlate: 'RJ 14 BB 5432',
    rating: 4.80,
    totalRides: 2800,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manoj',
    location: { lat: BASE_LAT + 0.006, lng: BASE_LNG + 0.011 }
  }
];

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Ride.deleteMany();

    // Insert riders
    const riders = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'rider',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'rider',
      }
    ];

    const createdRiders = await User.insertMany(riders);

    // Insert drivers (use create for proper password hashing via pre-save hook)
    const createdDrivers = [];
    for (const driver of driverData) {
      const d = await User.create(driver);
      createdDrivers.push(d);
    }

    // Create sample rides
    const rider1 = createdRiders[0]._id;
    const driver1 = createdDrivers[0]._id;

    const dummyRides = [
      {
        rider: rider1,
        driver: driver1,
        pickupLocation: {
          lat: 26.9124,
          lng: 75.7873,
          address: 'Hawa Mahal, Jaipur'
        },
        dropoffLocation: {
          lat: 26.9530,
          lng: 75.8514,
          address: 'Amer Fort, Jaipur'
        },
        status: 'completed',
        fare: 250
      },
      {
        rider: rider1,
        pickupLocation: {
          lat: 26.9124,
          lng: 75.7873,
          address: 'Jaipur Railway Station'
        },
        dropoffLocation: {
          lat: 26.8241,
          lng: 75.8055,
          address: 'Jaipur International Airport'
        },
        status: 'requested',
        fare: 350
      }
    ];

    await Ride.insertMany(dummyRides);

    console.log(`✅ Data Imported Successfully!`);
    console.log(`   • ${createdRiders.length} riders`);
    console.log(`   • ${createdDrivers.length} drivers`);
    console.log(`   • ${dummyRides.length} rides`);
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Ride.deleteMany();

    console.log('✅ All data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
