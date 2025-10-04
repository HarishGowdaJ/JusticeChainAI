import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from './SocketProvider';
import './TopNotificationBell.css';

const TopNotificationBell = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Emit socket event
        if (socket) {
          socket.emit('mark-notification-read', notificationId);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Format notification time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (socket && user) {
      // Join user-specific room
      socket.emit('join-user', user.id);

      // Listen for new notifications
      socket.on('newComplaint', (data) => {
        if (user.role === 'police') {
          fetchUnreadCount();
        }
      });

      socket.on('firFiled', (data) => {
        if (user.role === 'citizen' && data.citizenId === user.id) {
          fetchUnreadCount();
        } else if (user.role === 'court') {
          fetchUnreadCount();
        }
      });

      socket.on('caseFiled', (data) => {
        if (user.role === 'citizen' && data.citizenId === user.id) {
          fetchUnreadCount();
        } else if (user.role === 'police' && data.policeId === user.id) {
          fetchUnreadCount();
        }
      });

      socket.on('notification-read', (notificationId) => {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      });

      return () => {
        socket.off('newComplaint');
        socket.off('firFiled');
        socket.off('caseFiled');
        socket.off('notification-read');
      };
    }
  }, [socket, user]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render if user is not logged in
  if (!user) return null;

  return (
    <div className="top-notification-bell" ref={notificationRef}>
      <button
        className="top-bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="top-notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="top-notification-dropdown">
          <div className="top-notification-header">
            <h3>Notifications</h3>
            <div className="top-notification-actions">
              {unreadCount > 0 && (
                <button
                  className="top-mark-all-read-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  ✓
                </button>
              )}
              <button
                className="top-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="top-notification-list">
            {loading ? (
              <div className="top-loading">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="top-no-notifications">
                🔔
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`top-notification-item ${!notification.isRead ? 'unread' : ''}`}
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(notification.priority)}`
                  }}
                >
                  <div className="top-notification-content">
                    <h4 className="top-notification-title">{notification.title}</h4>
                    <p className="top-notification-message">{notification.message}</p>
                    <span className="top-notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  <div className="top-notification-actions">
                    {!notification.isRead && (
                      <button
                        className="top-mark-read-btn"
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="top-delete-btn"
                      onClick={() => deleteNotification(notification._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="top-notification-footer">
              <button
                className="top-view-all-btn"
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to full notifications page if needed
                }}
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopNotificationBell;
