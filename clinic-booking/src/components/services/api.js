import axios from 'axios';

/* ── base URL ──────────────────────────────────────────────────
   In dev Vite's proxy rewrites /api → http://localhost:5000.
   In production set VITE_API_URL to your deployed backend.
*/
const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });

/* ── attach JWT on every request ──────────────────────────── */
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('medibook_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ── auto-logout on 401 ───────────────────────────────────── */
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medibook_token');
      localStorage.removeItem('medibook_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/* ── named helpers ─────────────────────────────────────────── */
export const authAPI = {
  register: body  => api.post('/auth/register', body),
  login:    body  => api.post('/auth/login',    body),
  me:       ()    => api.get('/auth/me'),
};

export const doctorAPI = {
  getAll:             params        => api.get('/doctors', { params }),
  getOne:             id            => api.get(`/doctors/${id}`),
  updateAvailability: (id, body)    => api.put(`/doctors/${id}/availability`, body),
  updateStatus:       (id, status)  => api.put(`/doctors/${id}/status`, { status }),
};

export const patientAPI = {
  getAll: ()          => api.get('/patients'),
  getOne: id          => api.get(`/patients/${id}`),
  update: (id, body)  => api.put(`/patients/${id}`, body),
};

export const appointmentAPI = {
  create:       body          => api.post('/appointments',            body),
  getAll:       params        => api.get('/appointments',             { params }),
  getOne:       id            => api.get(`/appointments/${id}`),
  updateStatus: (id, status)  => api.put(`/appointments/${id}/status`, { status }),
};

export const prescriptionAPI = {
  create: body => api.post('/prescriptions', body),
  getAll: ()   => api.get('/prescriptions'),
  getOne: id   => api.get(`/prescriptions/${id}`),
};

export default api;
