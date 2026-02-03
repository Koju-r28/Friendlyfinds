import { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('http://localhost:5000/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.success) setNotifications(data.notifications);
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
  };

  //  INITIAL LOAD + AUTO REFRESH
   useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
