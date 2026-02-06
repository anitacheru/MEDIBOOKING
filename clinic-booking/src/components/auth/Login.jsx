import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../App.jsx";
import { authAPI } from '../services/api.js';
import '../auth/auth.css';
import DoctorDashboard from '../dashboard/DoctorDashboard.jsx';

const Login = () => {
 const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password)
      return setError('Please enter email and password.');

    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      login(res.data.token, res.data.user);
      console.log(res.data);
      console.log("ROLE:", res.data.user?.role);
    }
     catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
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
          <h2>Welcome<br/>back.</h2>
          <p>Sign in to your account to continue managing your health and appointments.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature-item"><span className="feature-check">✓</span>Secure login</div>
          <div className="auth-feature-item"><span className="feature-check">✓</span>Instant notifications</div>
          <div className="auth-feature-item"><span className="feature-check">✓</span>All your data in one place</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Enter your credentials to access your account.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>

            <div className="auth-form-footer">
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-register">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
