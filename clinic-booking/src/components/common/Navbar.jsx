import React from 'react';
import { useAuth } from "../App.jsx";
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import '../common/navbar.css';

const Navbar = ({ pageTitle, breadcrumb }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {breadcrumb && <span className="navbar-breadcrumb">{breadcrumb}</span>}
        <h1 className="navbar-title">{pageTitle || 'Dashboard'}</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-role-badge">{user?.role}</div>
        <NotificationBell />
        <div className="navbar-user">
          <div className="navbar-avatar">{user?.name?.split(' ').map(n => n[0]).join('').slice(0,2) || 'U'}</div>
          <span className="navbar-username">{user?.name}</span>
        </div>
        <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
