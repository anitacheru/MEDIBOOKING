require('dotenv').config();

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const { rateLimit }= require('express-rate-limit');
const connectDB    = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

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
app.use('/api/auth',          require('./src/routes/auth'));
app.use('/api/doctors',       require('./src/routes/doctors'));
app.use('/api/patients',      require('./src/routes/patients'));
app.use('/api/appointments',  require('./src/routes/appointments'));
app.use('/api/prescriptions', require('./src/routes/prescriptions'));
app.use('/api/notifications', require('./src/routes/notifications'));

/* ── 404 ───────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

/* ── global error handler (last) ───────────────────────────── */
app.use(errorHandler);

/* ── boot ──────────────────────────────────────────────────── */
connectDB().then(() => {
  app.listen(PORT, () => console.log(`[MediBook API] http://localhost:${PORT}`));
});
