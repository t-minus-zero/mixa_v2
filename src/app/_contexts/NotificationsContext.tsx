"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Portal from '../_components/portal/Portal';
import NotificationItem from '@/app/_components/notifications/NotificationItem';

// Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number; // in milliseconds
  createdAt: number;
}

interface NotificationsContextType {
  notifications: Notification[];
  viewQueue: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Create context
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);



// Provider component
export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewQueue, setViewQueue] = useState<Notification[]>([]);
  
  // Helper to generate unique IDs
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = generateId();
    
    // Force duration to be 10 seconds (10000ms) regardless of what's passed in
    // This ensures consistency
    const fixedDuration = 10000;
    
    const newNotification: Notification = {
      ...notification,
      id,
      duration: fixedDuration,
      createdAt: Date.now(),
    };
    
    console.log(`Creating notification ${id} with FIXED duration: ${fixedDuration}ms`);
    
    // Add to both arrays
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep maximum 100 notifications in history
      return updated.slice(0, 100);
    });
    
    setViewQueue(prev => [newNotification, ...prev]);
    
    // Auto-remove from view queue after duration
    if (newNotification.duration > 0) {
      console.log(`Setting timeout for notification ${id} with duration ${newNotification.duration}ms`);
      const timeoutId = setTimeout(() => {
        console.log(`Timeout triggered for notification ${id}`);
        removeFromViewQueue(id);
      }, newNotification.duration);
      
      // Save the timeout ID to the window object for debugging
      // @ts-ignore
      window.__notificationTimeouts = window.__notificationTimeouts || {};
      // @ts-ignore
      window.__notificationTimeouts[id] = timeoutId;
    }
    
    return id;
  };
  
  // Remove from view queue
  const removeFromViewQueue = (id: string) => {
    console.log(`Removing notification ${id} from view queue at ${new Date().toISOString()}`);
    
    // Log the stack trace to see where this is being called from
    console.log('Removal call stack:', new Error().stack);
    
    setViewQueue(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification) {
        const lifespan = Date.now() - notification.createdAt;
        console.log(`Notification ${id} lived for ${lifespan}ms (expected: ${notification.duration}ms)`);
      }
      return prev.filter(notification => notification.id !== id);
    });
  };
  
  // Remove notification from both arrays
  const removeNotification = (id: string) => {
    setViewQueue(prev => prev.filter(notification => notification.id !== id));
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setViewQueue([]);
    setNotifications([]);
  };
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        viewQueue,
        addNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
      
      {/* Render notifications using Portal */}
      <Portal 
        show={viewQueue.length > 0}
        position={{ 
          top: '16px', 
          left: '50%',
          width: '320px'
        }}
        className="flex flex-col gap-2 -translate-x-1/2"
        zIndex={100}
      >
        {viewQueue.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </Portal>
    </NotificationsContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export default NotificationsProvider;
