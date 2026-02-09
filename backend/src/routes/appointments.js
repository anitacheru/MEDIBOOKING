const express     = require('express');
const Appointment = require('../models/Appointment');
const Doctor      = require('../models/Doctor');
const User        = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  notifyAppointmentBooked,
  notifyAppointmentAccepted,
  notifyAppointmentCompleted,
  notifyAppointmentCancelled,
} = require('../services/notificationService');

const router = express.Router();

/* ── POST /api/appointments ────────────────────────────────── (patient) */
router.post('/', verifyToken, authorizeRoles('patient'), async (req, res) => {
  try {
    const { doctorId, disease, specialty, date, time, notes } = req.body;
    if (!doctorId || !disease || !date || !time)
      return res.status(400).json({ success: false, message: 'doctorId, disease, date and time are required.' });

    const doc = await Doctor.findById(doctorId).populate('userId');
    if (!doc || doc.status !== 'Enabled')
      return res.status(400).json({ success: false, message: 'Doctor is not available.' });

    const appt = await Appointment.create({
      patient:   req.user.id,
      doctor:    doctorId,
      disease,
      specialty: specialty || doc.specialty,
      date, time,
      notes: notes || '',
    });

    // notify both parties
    const patientUser = await User.findById(req.user.id);
    await notifyAppointmentBooked(appt, patientUser, doc.userId);

    res.status(201).json({ success: true, message: 'Appointment booked.', data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/appointments ──────────────────────────────────── */
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ userId: req.user.id });
      if (doc) filter.doctor = doc._id;
    }

    if (req.query.status) filter.status = req.query.status;

    const list = await Appointment.find(filter)
      .populate('patient', 'name email')
      .populate('doctor',  'specialty userId')
      .sort({ createdAt: -1 });

    // flatten doctor's user name
    const rows = await Promise.all(list.map(async a => {
      const obj = a.toObject();
      if (a.doctor?.userId) {
        const u = await User.findById(a.doctor.userId, 'name');
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

/* ── GET /api/appointments/:id ────────────────────────────── */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor',  'specialty userId');
    if (!appt)
      return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PUT /api/appointments/:id/status ──────────────────────── (admin | doctor) */
router.put('/:id/status', verifyToken, authorizeRoles('admin','doctor'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending','Accepted','Completed','Cancelled'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value.' });

    const appt = await Appointment.findById(req.params.id)
      .populate('doctor', 'userId')
      .populate('patient');
    if (!appt)
      return res.status(404).json({ success: false, message: 'Not found.' });

    // doctor guard
    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ userId: req.user.id });
      if (!doc || appt.doctor._id.toString() !== doc._id.toString())
        return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const oldStatus = appt.status;
    appt.status = status;
    await appt.save();

    // notifications
    const doctorUser  = await User.findById(appt.doctor.userId);
    const patientUser = appt.patient;

    if (oldStatus === 'Pending' && status === 'Accepted') {
      await notifyAppointmentAccepted(appt, patientUser, doctorUser);
    }
    if (status === 'Completed') {
      await notifyAppointmentCompleted(appt, patientUser, doctorUser);
    }
    if (status === 'Cancelled') {
      const cancelledBy = req.user.role === 'doctor' ? 'doctor' : 'admin';
      await notifyAppointmentCancelled(appt, patientUser, doctorUser, cancelledBy);
    }

    res.json({ success: true, message: `Appointment ${status}.`, data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
