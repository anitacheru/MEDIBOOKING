const mongoose = require('mongoose');

const medSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  dosage:    { type: String, trim: true, default: '' },
  frequency: { type: String, trim: true, default: '' },
  duration:  { type: String, trim: true, default: '' },
}, { _id: false });

const schema = new mongoose.Schema({
  doctor:    { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  medicines: {
    type: [medSchema],
    required: true,
    validate: { validator: v => Array.isArray(v) && v.length > 0, message: 'At least one medicine required.' }
  },
  notes: { type: String, trim: true, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', schema);
