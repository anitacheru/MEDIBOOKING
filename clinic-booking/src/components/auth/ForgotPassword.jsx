import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    // TODO: API call to send reset link
    setSubmitted(true);
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
          <h2>Reset your<br/>password.</h2>
          <p>We'll send a secure reset link to your registered email address.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: 380 }}>
          {submitted ? (
            <div className="success-block">
              <div className="success-icon">✉</div>
              <h3>Check Your Email</h3>
              <p>We've sent a password reset link to <strong>{email}</strong>. Check your inbox (and spam folder).</p>
              <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h2>Forgot Password</h2>
              <p className="auth-subtitle">Enter your email to receive a reset link.</p>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <button type="submit" className="btn btn-primary btn-full">Send Reset Link</button>
              </form>
              <div className="auth-register" style={{ marginTop: 20 }}>
                <p><Link to="/login">← Back to Sign In</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
