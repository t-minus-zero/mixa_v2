"use client"

import React, { useEffect, useState } from 'react';
import { Notification } from '@/app/_contexts/NotificationsContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // For animation effect
  useEffect(() => {
    // Small delay to ensure component is mounted before animation starts
    const animationTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(animationTimer);
  }, []);

  // Icon and background color based on notification type
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: <CheckCircle size={20} />,
          gradientFrom: 'from-green-100/50',
          gradientTo: 'to-green-200/50',
          glowColor: 'rgba(34, 197, 94, 0.05)', // Very light transparent green
          hoverGlow: 'rgba(34, 197, 94, 0.2)', // Stronger for hover
          borderColor: 'border-green-300', // Lighter green
          textColor: 'text-white',
          iconColor: 'text-green-400',
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} />,
          gradientFrom: 'from-red-100/50',
          gradientTo: 'to-red-200/50',
          glowColor: 'rgba(239, 68, 68, 0.05)', // Very light transparent red
          hoverGlow: 'rgba(239, 68, 68, 0.2)', // Stronger for hover
          borderColor: 'border-red-300', // Lighter red
          textColor: 'text-white',
          iconColor: 'text-red-400',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} />,
          gradientFrom: 'from-amber-100/50',
          gradientTo: 'to-amber-300/50',
          glowColor: 'rgba(245, 158, 11, 0.05)', // Very light transparent amber
          hoverGlow: 'rgba(245, 158, 11, 0.2)', // Stronger for hover
          borderColor: 'border-amber-300', // Lighter amber
          textColor: 'text-white',
          iconColor: 'text-amber-400',
        };
      default: // info
        return {
          icon: <Info size={20} />,
          gradientFrom: 'from-blue-100/50',
          gradientTo: 'to-blue-300/50',
          glowColor: 'rgba(59, 130, 246, 0.05)', // Very light transparent blue
          hoverGlow: 'rgba(59, 130, 246, 0.2)', // Stronger for hover
          borderColor: 'border-blue-300', // Lighter blue
          textColor: 'text-white',
          iconColor: 'text-blue-400',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`
        bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} backdrop-blur-md
        rounded-xl border ${styles.borderColor} border-opacity-50
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        mb-3 flex items-start w-full overflow-hidden

      `}
      role="alert"
      style={{
        boxShadow: 'none',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 15px ${styles.hoverGlow}, 0 0 8px ${styles.hoverGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="absolute inset-0 bg-black/5 backdrop-blur-sm z-0"></div>
      
      <div className={`flex-shrink-0 ${styles.iconColor} mr-3 z-10 p-4`}>
        {styles.icon}
      </div>
      
      <div className="flex-grow z-10 py-4 pr-2">
        <p className={`text-sm font-medium ${styles.textColor}`}>
          {notification.message}
        </p>
      </div>
      
      <button 
        type="button" 
        className="self-start mt-3 mr-3 rounded-full p-1 inline-flex h-6 w-6 bg-white/20 hover:bg-white/40 z-10 focus:outline-none" 
        aria-label="Close"
        onClick={onClose}
      >
        <X size={14} className="text-white" />
      </button>
    </div>
  );
};

export default NotificationItem;
