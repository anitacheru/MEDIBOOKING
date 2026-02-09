const express = require('express');
const Doctor  = require('../models/Doctor');
const User    = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/auth.js');
const { notifyDoctorEnabled } = require('../services/notificationService');

const router = express.Router();

/* ── GET /api/doctors ──────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.specialty) filter.specialty = req.query.specialty;
    if (req.query.status)    filter.status    = req.query.status;

    const docs = await Doctor.find(filter).populate('userId', 'name email');
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/doctors/my-profile ───────────────────────────── (doctor) */
router.get('/my-profile', verifyToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const doc = await Doctor.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!doc)
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/doctors/:id ──────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id).populate('userId', 'name email');
    if (!doc)
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PUT /api/doctors/:id/availability ─────────────────────── (doctor) */
router.put('/:id/availability', verifyToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id);
    if (!doc)
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    if (doc.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Can only edit your own availability.' });

    doc.availability = req.body.availability;
    await doc.save();
    res.json({ success: true, message: 'Availability updated.', data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PUT /api/doctors/:id/status ───────────────────────────── (admin) */
router.put('/:id/status', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Enabled','Pending','Disabled'].includes(status))
      return res.status(400).json({ success: false, message: 'Status must be Enabled, Pending or Disabled.' });

    const doc = await Doctor.findById(req.params.id).populate('userId');
    if (!doc)
      return res.status(404).json({ success: false, message: 'Doctor not found.' });

    const oldStatus = doc.status;
    doc.status = status;
    await doc.save();

    // notify doctor if just enabled
    if (oldStatus !== 'Enabled' && status === 'Enabled') {
      await notifyDoctorEnabled(doc.userId);
    }

    res.json({ success: true, message: `Doctor ${status}.`, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
