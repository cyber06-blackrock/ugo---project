const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ugo-clone';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['rider', 'driver'], default: 'rider' },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  isAvailable: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 10 realistic drivers spread around Jaipur
const drivers = [
  { name: 'Ramesh Kumar',    email: 'ramesh.driver@ugo.com',  lat: 26.9124, lng: 75.7873 },
  { name: 'Suresh Sharma',   email: 'suresh.driver@ugo.com',  lat: 26.9200, lng: 75.7950 },
  { name: 'Priya Patel',     email: 'priya.driver@ugo.com',   lat: 26.9050, lng: 75.7800 },
  { name: 'Arjun Singh',     email: 'arjun.driver@ugo.com',   lat: 26.9300, lng: 75.7700 },
  { name: 'Meena Verma',     email: 'meena.driver@ugo.com',   lat: 26.8990, lng: 75.7980 },
  { name: 'Anil Gupta',      email: 'anil.driver@ugo.com',    lat: 26.9180, lng: 75.8050 },
  { name: 'Kavita Joshi',    email: 'kavita.driver@ugo.com',  lat: 26.9400, lng: 75.7820 },
  { name: 'Deepak Yadav',    email: 'deepak.driver@ugo.com',  lat: 26.9070, lng: 75.8100 },
  { name: 'Sunita Rawat',    email: 'sunita.driver@ugo.com',  lat: 26.9250, lng: 75.7650 },
  { name: 'Vikram Choudhary',email: 'vikram.driver@ugo.com',  lat: 26.9150, lng: 75.7770 },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Driver@123', salt);

    let inserted = 0;
    for (const d of drivers) {
      const exists = await User.findOne({ email: d.email });
      if (exists) {
        console.log(`⚠️  Skipping ${d.name} (already exists)`);
        continue;
      }
      await User.create({
        name: d.name,
        email: d.email,
        password: hashedPassword,
        role: 'driver',
        isAvailable: true,
        location: { lat: d.lat, lng: d.lng }
      });
      console.log(`✅ Created driver: ${d.name}`);
      inserted++;
    }

    console.log(`\n🎉 Done! Inserted ${inserted} new driver(s).`);
    console.log('🔑 All drivers use password: Driver@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();
