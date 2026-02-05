const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const schema = new mongoose.Schema({
  name:          { type: String,  required: true,  trim: true },
  email:         { type: String,  required: true,  unique: true, lowercase: true, trim: true },
  password:      { type: String,  required: true,  minlength: 6 },
  role:          { type: String,  required: true,  enum: ['admin','doctor','patient'], default: 'patient' },
  emailVerified: { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

// hash on create / update
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// plain-text compare helper
schema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// never leak password in API responses
schema.set('toJSON', {
  transform(_doc, obj) { delete obj.password; return obj; }
});

module.exports = mongoose.model('User', schema);
