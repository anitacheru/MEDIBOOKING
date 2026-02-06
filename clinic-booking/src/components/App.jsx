import React, { createContext, useContext, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// ─── AUTH CONTEXT ────────────────────────────────────────────────
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (token, user) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(user));
  };;

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ─── ROUTE GUARD ────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// ─── LAZY IMPORTS ──────────────────────────────────────────────
import Login            from './auth/Login';
import Register         from './auth/Register';
import ForgotPassword   from './auth/ForgotPassword';
import AdminDashboard   from './dashboard/AdminDashboard';
import DoctorDashboard  from './dashboard/DoctorDashboard';
import PatientDashboard from './dashboard/PatientDashboard';

// ─── APP ────────────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected dashboards */}
        <Route path="/admin/*" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/doctor/*" element={
          <ProtectedRoute><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/patient/*" element={
          <ProtectedRoute><PatientDashboard /></ProtectedRoute>
        } />

        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

// ─── ROOT REDIRECT ──────────────────────────────────────────────
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/dashboard" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

export default App;
