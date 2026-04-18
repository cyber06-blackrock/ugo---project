const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['rider', 'driver'],
    default: 'rider'
  },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  // Driver-specific fields
  vehicleType: {
    type: String,
    enum: ['UgoX', 'UgoXL', 'UgoBlack', 'UgoAuto', 'UgoMoto'],
    default: 'UgoX'
  },
  vehicleName: {
    type: String,
    default: ''
  },
  licensePlate: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  profilePhoto: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
