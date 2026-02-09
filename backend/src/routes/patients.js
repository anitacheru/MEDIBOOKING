const express  = require('express');
const Patient  = require('../models/Patient');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/* ── GET /api/patients ─────────────────────────────────────── */
router.get('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const list = await Patient.find().populate('userId', 'name email');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/patients/my-profile ──────────────────────────── (patient) */
router.get('/my-profile', verifyToken, authorizeRoles('patient'), async (req, res) => {
  try {
    const p = await Patient.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!p)
      return res.status(404).json({ success: false, message: 'Patient profile not found.' });
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/patients/:id ─────────────────────────────────── */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const p = await Patient.findById(req.params.id).populate('userId', 'name email');
    if (!p)
      return res.status(404).json({ success: false, message: 'Patient not found.' });

    if (req.user.role !== 'admin' && p.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });

    res.json({ success: true, data: p });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PUT /api/patients/:id ─────────────────────────────────── */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const p = await Patient.findById(req.params.id);
    if (!p)
      return res.status(404).json({ success: false, message: 'Patient not found.' });

    if (req.user.role !== 'admin' && p.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });

    ['dob','phone','address','emergencyContact','notifications'].forEach(field => {
      if (req.body[field] !== undefined) p[field] = req.body[field];
    });
    await p.save();

    res.json({ success: true, message: 'Profile updated.', data: p });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
