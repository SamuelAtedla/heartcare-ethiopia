import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, duration = 5000) => {
    const id = uuidv4();
    setNotifications((prev) => [...prev, { id, type, message }]);

    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const notify = {
    success: (message, duration) => addNotification('success', message, duration),
    error: (message, duration) => addNotification('error', message, duration),
    warning: (message, duration) => addNotification('warning', message, duration),
    info: (message, duration) => addNotification('info', message, duration),
  };

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification, notify }}>
      {children}
    </NotificationContext.Provider>
  );
};
