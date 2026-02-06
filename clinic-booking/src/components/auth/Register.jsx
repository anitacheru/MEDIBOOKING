import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../App.jsx";
import { authAPI } from '../services/api.js';
import '../auth/auth.css';

const Register = () => {
  const navigate = useAuth();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    specialty: '',
    licenseNumber: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // validation
    if (!form.name || !form.email || !form.password || !form.role)
      return setError('Please fill all required fields.');
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match.');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters.');
    if (form.role === 'doctor' && !form.specialty)
      return setError('Specialty is required for doctors.');

    setLoading(true);
    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        specialty: form.specialty || undefined,
        licenseNumber: form.licenseNumber || undefined,
        phone: form.phone || undefined,
      });

      // auto-login
      login(res.data.token, res.data.user);

      setSuccess(true);
      setTimeout(() => navigate(`/${res.data.user.role}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#fff"/>
            <rect x="12" y="6"  width="4" height="16" rx="2" fill="#0f0f0f"/>
            <rect x="6"  y="12" width="16" height="4"  rx="2" fill="#0f0f0f"/>
            <polyline points="10,22 13,22 15,18 17,25 19,20 21,22" stroke="#0f0f0f" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1>Medi<span style={{ fontWeight: 300, opacity: 0.7 }}>Book</span></h1>
        </div>
        <div className="auth-welcome">
          <h2>Join MediBook<br/>today.</h2>
          <p>Create your account to book appointments, manage your health, and connect with trusted medical professionals.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature-item"><span className="feature-check">✓</span>Secure & private accounts</div>
          <div className="auth-feature-item"><span className="feature-check">✓</span>Real-time notifications</div>
          <div className="auth-feature-item"><span className="feature-check">✓</span>Professional verification</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {success ? (
            <div className="success-block">
              <div className="success-icon">✓</div>
              <h3>Account Created!</h3>
              <p>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <h2>Create Account</h2>
              <p className="auth-subtitle">Sign up to get started with MediBook.</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} placeholder="••••••" />
                  </div>
                  <div className="form-group">
                    <label>Confirm</label>
                    <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••" />
                  </div>
                </div>

                <div className="form-group">
                  <label>I am a...</label>
                  <select className="form-control" name="role" value={form.role} onChange={handleChange}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {form.role === 'doctor' && (
                  <>
                    <div className="form-group">
                      <label>Specialty *</label>
                      <input type="text" className="form-control" name="specialty" value={form.specialty} onChange={handleChange} placeholder="e.g. Cardiologist" />
                    </div>
                    <div className="form-group">
                      <label>License Number (optional)</label>
                      <input type="text" className="form-control" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="Optional" />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Phone (optional)</label>
                  <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="auth-register">
                <p>Already have an account? <Link to="/login">Sign in</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
