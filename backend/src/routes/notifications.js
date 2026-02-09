const express      = require('express');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/* ── GET /api/notifications ────────────────────────────────── */
router.get('/', verifyToken, async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);                // last 50
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/notifications/unread-count ───────────────────── */
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, read: false });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PUT /api/notifications/:id/read ───────────────────────── */
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif)
      return res.status(404).json({ success: false, message: 'Not found.' });
    if (notif.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });

    notif.read = true;
    await notif.save();
    res.json({ success: true, data: notif });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PUT /api/notifications/mark-all-read ──────────────────── */
router.put('/mark-all-read', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
