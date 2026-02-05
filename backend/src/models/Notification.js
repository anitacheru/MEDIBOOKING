const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['appointment_booked','appointment_accepted','appointment_completed','appointment_cancelled','prescription_issued','doctor_enabled'], required: true },
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId },  // appointment or prescription ID
}, { timestamps: true });

module.exports = mongoose.model('Notification', schema);
