import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import '../common/NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch unread count on mount and poll every 30s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div className="notif-bell-wrap">
      <button className="notif-bell-btn" onClick={handleOpen}>
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {showDropdown && (
        <>
          <div className="notif-overlay" onClick={() => setShowDropdown(false)} />
          <div className="notif-dropdown">
            <div className="notif-header">
              <h4>Notifications</h4>
              {unreadCount > 0 && (
                <button className="btn btn-sm" onClick={markAllRead}>Mark all read</button>
              )}
            </div>

            {loading && <div className="notif-loading">Loading...</div>}

            {!loading && notifications.length === 0 && (
              <div className="notif-empty">No notifications yet.</div>
            )}

            {!loading && notifications.map(n => (
              <div key={n._id} className={`notif-item ${n.read ? 'read' : 'unread'}`} onClick={() => !n.read && markAsRead(n._id)}>
                <div className="notif-item-header">
                  <span className="notif-title">{n.title}</span>
                  {!n.read && <span className="notif-dot" />}
                </div>
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
