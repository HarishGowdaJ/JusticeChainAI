import React, { useState } from 'react';
import './NotificationBell.css';

const SimpleNotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get notifications based on user type
  const getNotifications = () => {
    if (!user) {
      return {
        notifications: [
          {
            id: 1,
            title: "Welcome to Justice System",
            message: "Please login to see your notifications",
            time: "Just now",
            isRead: false,
            priority: "medium"
          }
        ],
        unreadCount: 1
      };
    }

    switch (user.type) {
      case 'citizen':
        return {
          notifications: [
            {
              id: 1,
              title: "FIR Filed for Your Complaint",
              message: "FIR FIR-2024-0001 has been filed for your theft complaint",
              time: "2m ago",
              isRead: false,
              priority: "high"
            },
            {
              id: 2,
              title: "Case File Generated",
              message: "Case file CASE-2024-0001 has been generated for your complaint",
              time: "1h ago",
              isRead: false,
              priority: "high"
            },
            {
              id: 3,
              title: "Hearing Scheduled",
              message: "Hearing scheduled for case CASE-2024-0001 on Dec 15, 2024",
              time: "2h ago",
              isRead: true,
              priority: "medium"
            },
            {
              id: 4,
              title: "Evidence Upload Required",
              message: "Please upload additional evidence for your complaint",
              time: "1d ago",
              isRead: true,
              priority: "low"
            }
          ],
          unreadCount: 2
        };

      case 'police':
        return {
          notifications: [
            {
              id: 1,
              title: "New Complaint Assigned",
              message: "New theft complaint assigned to you by Station Head",
              time: "5m ago",
              isRead: false,
              priority: "urgent"
            },
            {
              id: 2,
              title: "Complaint Review Required",
              message: "Complaint #1234 requires your review and FIR filing",
              time: "30m ago",
              isRead: false,
              priority: "high"
            },
            {
              id: 3,
              title: "Investigation Update",
              message: "Suspect identified for complaint #1233",
              time: "2h ago",
              isRead: true,
              priority: "medium"
            },
            {
              id: 4,
              title: "Court Summons",
              message: "Court summons for case CASE-2024-0001 hearing",
              time: "1d ago",
              isRead: true,
              priority: "high"
            },
            {
              id: 5,
              title: "Evidence Analysis Complete",
              message: "Forensic analysis completed for complaint #1232",
              time: "2d ago",
              isRead: true,
              priority: "medium"
            }
          ],
          unreadCount: 2
        };

      case 'court':
        return {
          notifications: [
            {
              id: 1,
              title: "New FIR Received",
              message: "FIR FIR-2024-0002 received from Central Police Station",
              time: "10m ago",
              isRead: false,
              priority: "high"
            },
            {
              id: 2,
              title: "Case File Creation Required",
              message: "Create case file for FIR FIR-2024-0001",
              time: "1h ago",
              isRead: false,
              priority: "high"
            },
            {
              id: 3,
              title: "Hearing Scheduled",
              message: "Hearing for case CASE-2024-0001 scheduled for tomorrow",
              time: "3h ago",
              isRead: true,
              priority: "medium"
            },
            {
              id: 4,
              title: "Judgment Due",
              message: "Judgment due for case CASE-2024-0000",
              time: "1d ago",
              isRead: true,
              priority: "urgent"
            },
            {
              id: 5,
              title: "Appeal Filed",
              message: "Appeal filed against judgment in case CASE-2024-0000",
              time: "2d ago",
              isRead: true,
              priority: "high"
            }
          ],
          unreadCount: 2
        };

      default:
        return {
          notifications: [],
          unreadCount: 0
        };
    }
  };

  const { notifications, unreadCount } = getNotifications();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getPortalTitle = () => {
    if (!user) return "Notifications";
    switch (user.type) {
      case 'citizen': return "Citizen Portal - Notifications";
      case 'police': return "Police Portal - Notifications";
      case 'court': return "Court Portal - Notifications";
      default: return "Notifications";
    }
  };

  console.log('SimpleNotificationBell rendered', { user, unreadCount, notifications });

  return (
    <div className="notification-bell" style={{ border: '2px solid red', padding: '5px' }}>
      <button
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>{getPortalTitle()}</h3>
            <div className="notification-actions">
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                🔔
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(notification.priority)}`
                  }}
                >
                  <div className="notification-content">
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                className="view-all-btn"
                onClick={() => setIsOpen(false)}
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

export default SimpleNotificationBell;
