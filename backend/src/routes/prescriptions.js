const express      = require('express');
const Prescription = require('../models/Prescription');
const Doctor       = require('../models/Doctor');
const User         = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { notifyPrescriptionIssued } = require('../services/notificationService');

const router = express.Router();

/* ── POST /api/prescriptions ───────────────────────────────── (doctor) */
router.post('/', verifyToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { patientId, medicines, notes } = req.body;
    if (!patientId || !medicines || !medicines.length)
      return res.status(400).json({ success: false, message: 'patientId and medicines are required.' });

    const doc = await Doctor.findOne({ userId: req.user.id }).populate('userId');
    if (!doc)
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });

    const rx = await Prescription.create({
      doctor: doc._id,
      patient: patientId,
      medicines,
      notes: notes || ''
    });

    // notify patient
    const patientUser = await User.findById(patientId);
    if (patientUser) {
      await notifyPrescriptionIssued(rx, patientUser, doc.userId);
    }

    res.status(201).json({ success: true, message: 'Prescription issued.', data: rx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/prescriptions ────────────────────────────────── */
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ userId: req.user.id });
      if (doc) filter.doctor = doc._id;
    }
    if (req.user.role === 'patient') filter.patient = req.user.id;

    const list = await Prescription.find(filter)
      .populate('doctor',  'specialty userId')
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    // flatten names
    const rows = await Promise.all(list.map(async rx => {
      const obj = rx.toObject();
      if (rx.doctor?.userId) {
        const u = await User.findById(rx.doctor.userId, 'name');
        obj.doctorName = u?.name || '';
      }
      obj.patientName = obj.patient?.name || '';
      return obj;
    }));

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/prescriptions/:id ────────────────────────────── */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const rx = await Prescription.findById(req.params.id)
      .populate('doctor',  'specialty userId')
      .populate('patient', 'name email');
    if (!rx)
      return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: rx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
