const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,   // allows multiple docs with no email (phone-only users)
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,   // allows multiple docs with no phone (email-only users)
    trim: true,
  },
  password: {
    type: String,
    // not required — phone/OTP users won't have a password
  },
  role: {
    type: String,
    enum: ['rider', 'driver'],
    default: 'rider',
  },
  profilePhoto: {
    type: String,  // Base64 or URL
    default: '',
  },
  // ── Driver-specific ───────────────────────────────────────────────
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  vehicleType: {
    type: String,
    enum: ['UgoX', 'UgoXL', 'UgoBlack', 'UgoAuto', 'UgoMoto'],
    default: 'UgoX',
  },
  vehicleName:  { type: String, default: '' },
  licensePlate: { type: String, default: '' },
  rating:       { type: Number, default: 4.5, min: 1, max: 5 },
  totalRides:   { type: Number, default: 0 },
  profilePhoto: { type: String, default: '' },
}, { timestamps: true });

// ── Hash password before saving (only if set/modified) ─────────────────────
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Compare password ───────────────────────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
