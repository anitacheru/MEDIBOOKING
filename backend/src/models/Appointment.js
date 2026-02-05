const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  patient:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  doctor:    { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  disease:   { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  date:      { type: String, required: true },
  time:      { type: String, required: true },
  status:    { type: String, enum: ['Pending','Accepted','Completed','Cancelled'], default: 'Pending' },
  notes:     { type: String, trim: true, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', schema);
