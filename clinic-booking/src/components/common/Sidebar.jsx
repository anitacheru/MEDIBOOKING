import React from 'react';
import './Sidebar.css';

const Sidebar = ({ navItems, activePage, onNavigate, role }) => {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#0f0f0f"/>
            <rect x="12" y="6"  width="4" height="16" rx="2" fill="#fff"/>
            <rect x="6"  y="12" width="16" height="4"  rx="2" fill="#fff"/>
            <polyline points="10,22 13,22 15,18 17,25 19,20 21,22" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="logo-text">Medi<span className="logo-light">Book</span></span>
      </div>

      {/* Role badge */}
      <div className="sidebar-role">
        <span className={`role-badge role-${role}`}>{role}</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
