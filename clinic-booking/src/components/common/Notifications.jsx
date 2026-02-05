import React, { useEffect } from 'react';
import './Notifications.css';

const Notifications = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  const typeClass = {
    success: 'notif-success',
    error:   'notif-error',
    info:    'notif-info',
    warning: 'notif-warning',
  };

  return (
    <div className={`notification ${typeClass[notification.type] || 'notif-info'}`}>
      <div className="notif-body">
        <span className="notif-icon">
          {notification.type === 'success' && '✓'}
          {notification.type === 'error'   && '✕'}
          {notification.type === 'warning' && '!'}
          {notification.type === 'info'    && 'i'}
        </span>
        <span className="notif-message">{notification.message}</span>
      </div>
      <button className="notif-close" onClick={onDismiss}>✕</button>
    </div>
  );
};

export default Notifications;
