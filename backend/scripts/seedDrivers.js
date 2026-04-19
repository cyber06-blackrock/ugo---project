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
  isAvailable: { type: Boolean, default: false },
  vehicleType: { type: String, default: 'UgoX' },
  vehicleName: { type: String, default: 'Swift Dzire' },
  rating: { type: Number, default: 4.5 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 30 realistic drivers spread around Jaipur
const drivers = [
  { name: 'Ramesh Kumar', email: 'ramesh.driver@ugo.com', lat: 26.9164, lng: 75.7873, type: 'UgoX', car: 'Swift Dzire' }, // ~1 min away (0.4km)
  { name: 'Suresh Sharma', email: 'suresh.driver@ugo.com', lat: 26.9044, lng: 75.7873, type: 'UgoXL', car: 'Ertiga' },    // ~2 min away (0.9km)
  { name: 'Priya Patel', email: 'priya.driver@ugo.com', lat: 26.9124, lng: 75.8003, type: 'UgoX', car: 'Hyundai i20' }, // ~3 min away (1.3km)
  { name: 'Arjun Singh', email: 'arjun.driver@ugo.com', lat: 26.9300, lng: 75.7700, type: 'UgoBlack', car: 'Mercedes C-Class' },
  { name: 'Meena Verma', email: 'meena.driver@ugo.com', lat: 26.8990, lng: 75.7980, type: 'UgoX', car: 'Tata Nexon' },
  { name: 'Anil Gupta', email: 'anil.driver@ugo.com', lat: 26.9180, lng: 75.8050, type: 'UgoX', car: 'Kia Sonet' },
  { name: 'Kavita Joshi', email: 'kavita.driver@ugo.com', lat: 26.9400, lng: 75.7820, type: 'UgoXL', car: 'Innova' },
  { name: 'Deepak Yadav', email: 'deepak.driver@ugo.com', lat: 26.9070, lng: 75.8100, type: 'UgoX', car: 'Honda City' },
  { name: 'Sunita Rawat', email: 'sunita.driver@ugo.com', lat: 26.9250, lng: 75.7650, type: 'UgoX', car: 'Maruti Baleno' },
  { name: 'Vikram Choudhary', email: 'vikram.driver@ugo.com', lat: 26.9150, lng: 75.7770, type: 'UgoBlack', car: 'BMW 3 Series' },
  { name: 'Rahul Malhotra', email: 'rahul.driver@ugo.com', lat: 26.9100, lng: 75.7900, type: 'UgoX', car: 'Hyundai Venue' },
  { name: 'Neha Saxena', email: 'neha.driver@ugo.com', lat: 26.9220, lng: 75.7850, type: 'UgoX', car: 'Tata Altroz' },
  { name: 'Karan Mehra', email: 'karan.driver@ugo.com', lat: 26.9000, lng: 75.7700, type: 'UgoXL', car: 'Mahindra XUV500' },
  { name: 'Pooja Sethi', email: 'pooja.driver@ugo.com', lat: 26.9350, lng: 75.8000, type: 'UgoX', car: 'Ford EcoSport' },
  { name: 'Amit Bhardwaj', email: 'amit.driver@ugo.com', lat: 26.8950, lng: 75.7850, type: 'UgoX', car: 'Maruti WagonR' },
  { name: 'Sanjay Jain', email: 'sanjay.driver@ugo.com', lat: 26.9280, lng: 75.8150, type: 'UgoBlack', car: 'Audi A4' },
  { name: 'Divya Kapoor', email: 'divya.driver@ugo.com', lat: 26.9140, lng: 75.7600, type: 'UgoX', car: 'Skoda Kushaq' },
  { name: 'Rohan Das', email: 'rohan.driver@ugo.com', lat: 26.9450, lng: 75.7900, type: 'UgoXL', car: 'Toyota Fortuner' },
  { name: 'Ishita Roy', email: 'ishita.driver@ugo.com', lat: 26.9080, lng: 75.7950, type: 'UgoX', car: 'Vokswagen Taigun' },
  { name: 'Vivek Mishra', email: 'vivek.driver@ugo.com', lat: 26.9200, lng: 75.7700, type: 'UgoX', car: 'Maruti Ciaz' },
  { name: 'Alok Pandey', email: 'alok.driver@ugo.com', lat: 26.9160, lng: 75.8200, type: 'UgoGo', car: 'Maruti Alto' },
  { name: 'Ritu Singh', email: 'ritu.driver@ugo.com', lat: 26.9320, lng: 75.7600, type: 'UgoGo', car: 'Tata Tiago' },
  { name: 'Manish Tiwari', email: 'manish.driver@ugo.com', lat: 26.8900, lng: 75.8000, type: 'UgoGo', car: 'Hyundai Santro' },
  { name: 'Nisha Grewal', email: 'nisha.driver@ugo.com', lat: 26.9400, lng: 75.8100, type: 'UgoX', car: 'Renault Kiger' },
  { name: 'Tarun Vashisht', email: 'tarun.driver@ugo.com', lat: 26.9100, lng: 75.8300, type: 'UgoX', car: 'Nissan Magnite' },
  { name: 'Geeta Phogat', email: 'geeta.driver@ugo.com', lat: 26.9250, lng: 75.8050, type: 'UgoXL', car: 'Kia Carens' },
  { name: 'Harish Babu', email: 'harish.driver@ugo.com', lat: 26.9020, lng: 75.7500, type: 'UgoGo', car: 'Maruti S-Presso' },
  { name: 'Jyoti Kumari', email: 'jyoti.driver@ugo.com', lat: 26.9380, lng: 75.7750, type: 'UgoGo', car: 'Datsun Go' },
  { name: 'Om Prakash', email: 'om.driver@ugo.com', lat: 26.9120, lng: 75.8400, type: 'UgoX', car: 'Maruti Swift' },
  { name: 'Shubham Gill', email: 'shubham.driver@ugo.com', lat: 26.9420, lng: 75.8250, type: 'UgoX', car: 'Hyundai Aura' },
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
        await User.updateOne({ email: d.email }, {
            isAvailable: true,
            location: { lat: d.lat, lng: d.lng },
            vehicleType: d.type,
            vehicleName: d.car,
            rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1))
        });
        console.log(`🔄 Updated driver: ${d.name}`);
        continue;
      }
      await User.create({
        name: d.name,
        email: d.email,
        password: hashedPassword,
        role: 'driver',
        isAvailable: true,
        location: { lat: d.lat, lng: d.lng },
        vehicleType: d.type,
        vehicleName: d.car,
        rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1))
      });
      console.log(`✅ Created driver: ${d.name}`);
      inserted++;
    }

    console.log(`\n🎉 Done! Processed ${drivers.length} drivers.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();
