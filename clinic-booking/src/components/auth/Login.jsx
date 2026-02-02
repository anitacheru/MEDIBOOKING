// src/components/auth/Login.jsx
import React, { useState } from 'react';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add validation and API call here
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Simulate login - replace with actual API call
    console.log('Logging in with:', { email, password });
    // Redirect to dashboard on success
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">
          <h1>MediBook</h1>
        </div>
        <div className="auth-welcome">
          <h2>Welcome to MediBook</h2>
          <p>Schedule appointments with doctors easily and manage your healthcare journey in one place.</p>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email or Phone</label>
              <input 
                type="text" 
                id="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            
            <div className="form-footer">
              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
            </div>
            
            <button type="submit" className="btn-primary btn-full">Sign In</button>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="social-login">
              <button type="button" className="btn-social btn-google">
                <span className="social-icon">G</span> Continue with Google
              </button>
              
              <button type="button" className="btn-social btn-facebook">
                <span className="social-icon">f</span> Continue with Facebook
              </button>
            </div>
            
            <div className="auth-register">
              <p>Don't have an account? <a href="/register">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;