const mongoose = require('mongoose');

const defaultAvailability = {
  Mon: { on: false, slots: [] },
  Tue: { on: false, slots: [] },
  Wed: { on: false, slots: [] },
  Thu: { on: false, slots: [] },
  Fri: { on: false, slots: [] },
  Sat: { on: false, slots: [] },
  Sun: { on: false, slots: [] },
};

const schema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialty:    { type: String, required: true, trim: true },
  licenseNumber:{ type: String, trim: true, default: '' },
  experience:   { type: String, trim: true, default: '' },
  phone:        { type: String, trim: true, default: '' },
  bio:          { type: String, trim: true, default: '' },
  status:       { type: String, enum: ['Pending','Enabled','Disabled'], default: 'Pending' },
  availability: { type: Object, default: defaultAvailability },
  notifications: {
    email: { type: Boolean, default: true },
    sms:   { type: Boolean, default: false },
  },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', schema);
