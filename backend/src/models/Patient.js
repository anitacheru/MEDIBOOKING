const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dob:    { type: String, trim: true, default: '' },
  phone:  { type: String, trim: true, default: '' },
  address:{ type: String, trim: true, default: '' },
  emergencyContact: {
    name:  { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms:   { type: Boolean, default: false },
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', schema);
