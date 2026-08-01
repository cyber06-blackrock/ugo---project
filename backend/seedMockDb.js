/**
 * Seed Mock Database with Test Data
 * Run this after server starts to populate in-memory database
 */

const mockDb = require('./config/mockDb');
const bcrypt = require('bcryptjs');

const seedMockDatabase = async () => {
  try {
    console.log('🌱 Seeding mock database...');

    // Hash password
    const hashedPassword = await bcrypt.hash('driver123', 10);

    // Create test driver: Amit
    const amit = await mockDb.createUser({
      name: 'Amit',
      email: 'amit@test.com',
      password: hashedPassword,
      role: 'driver',
      isAvailable: false,
      vehicleType: 'UgoX',
      vehicleName: 'Maruti Swift',
      licensePlate: 'RJ 14 AB 1234',
      rating: 4.9,
      totalRides: 150,
      location: { lat: 26.9124, lng: 75.7873 }
    });

    // Create test driver: Priya
    const priya = await mockDb.createUser({
      name: 'Priya',
      email: 'priya@test.com',
      password: hashedPassword,
      role: 'driver',
      isAvailable: false,
      vehicleType: 'UgoXL',
      vehicleName: 'Toyota Innova',
      licensePlate: 'RJ 14 CD 5678',
      rating: 4.8,
      totalRides: 200,
      location: { lat: 26.9150, lng: 75.7900 }
    });

    // Create test rider
    const john = await mockDb.createUser({
      name: 'John Doe',
      email: 'john@test.com',
      password: hashedPassword,
      role: 'rider'
    });

    console.log('✅ Mock database seeded successfully!');
    console.log(`   • Amit (driver) - ID: ${amit._id}`);
    console.log(`   • Priya (driver) - ID: ${priya._id}`);
    console.log(`   • John (rider) - ID: ${john._id}`);
    console.log('\n📝 Login credentials:');
    console.log('   Email: amit@test.com | Password: driver123');
    console.log('   Email: priya@test.com | Password: driver123');
    console.log('   Email: john@test.com | Password: driver123');
  } catch (error) {
    console.error('❌ Error seeding mock database:', error);
  }
};

module.exports = seedMockDatabase;

// Allow running directly
if (require.main === module) {
  seedMockDatabase().then(() => {
    console.log('\n✨ Seeding complete!');
  });
}
