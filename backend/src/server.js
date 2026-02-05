require('dotenv').config();

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const { rateLimit }= require('express-rate-limit');
const connectDB    = require('./config/db');           // ← Fixed
const errorHandler = require('./middleware/errorHandler'); // ← Fixed

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── security ──────────────────────────────────────────────── */
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

/* ── body ──────────────────────────────────────────────────── */
app.use(express.json());

/* ── health ────────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

/* ── routes ────────────────────────────────────────────────── */
app.use('/api/auth',          require('./routes/auth'));          // ← Fixed
app.use('/api/doctors',       require('./routes/doctors'));       // ← Fixed
app.use('/api/patients',      require('./routes/patients'));      // ← Fixed
app.use('/api/appointments',  require('./routes/appointments'));  // ← Fixed
app.use('/api/prescriptions', require('./routes/prescriptions')); // ← Fixed
app.use('/api/notifications', require('./routes/notifications')); // ← Fixed

/* ── 404 ───────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

/* ── global error handler (last) ───────────────────────────── */
app.use(errorHandler);

/* ── boot ──────────────────────────────────────────────────── */
connectDB().then(() => {
  app.listen(PORT, () => console.log(`[MediBook API] http://localhost:${PORT}`));
});