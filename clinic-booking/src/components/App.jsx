import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// ─── AUTH CONTEXT ───────────────────────────────────────────────────
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // user shape: { email, role: 'admin' | 'doctor' | 'patient', name }

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ─── ROUTE GUARD ────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// ─── LAZY IMPORTS ───────────────────────────────────────────────────
import Login            from './auth/Login';
import Register         from './auth/Register';
import ForgotPassword   from './auth/ForgotPassword';
import AdminDashboard   from './dashboard/AdminDashboard';
import DoctorDashboard  from './dashboard/DoctorDashboard';
import PatientDashboard from './dashboard/PatientDashboard';

// ─── APP ────────────────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected dashboards — each dashboard internally renders
            Sidebar + Navbar and its own nested pages */}
        <Route path="/admin/*" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/doctor/*" element={
          <ProtectedRoute><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/patient/*" element={
          <ProtectedRoute><PatientDashboard /></ProtectedRoute>
        } />

        {/* Catch-all → redirect based on role */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

export default App;
