const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const Doctor  = require('../models/Doctor');
const Patient = require('../models/Patient');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/* ── POST /api/auth/register ─────────────────────────────────
   NO MOCK DATA - every user creates their own real account
*/
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, specialty, licenseNumber, phone } = req.body;

    // validation
    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, message: 'Name, email, password and role are required.' });
    if (!['admin','doctor','patient'].includes(role))
      return res.status(400).json({ success: false, message: 'Role must be admin, doctor or patient.' });
    
    // doctors MUST provide specialty
    if (role === 'doctor' && !specialty)
      return res.status(400).json({ success: false, message: 'Specialty is required for doctors.' });

    // duplicate check
    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    // create user (password hashed by pre-save hook)
    const user = await User.create({ name, email, password, role });

    // create role-specific profile
    if (role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialty,
        licenseNumber: licenseNumber || '',
        phone: phone || '',
        status: 'Pending',   // admin must approve
      });
    }
    if (role === 'patient') {
      await Patient.create({
        userId: user._id,
        phone: phone || '',
      });
    }

    // auto-login: issue JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: role === 'doctor'
        ? 'Account created. Pending admin approval before you can accept appointments.'
        : 'Account created successfully.',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /api/auth/login ────────────────────────────────────*/
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/auth/me ────────────────────────────────────────*/
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
