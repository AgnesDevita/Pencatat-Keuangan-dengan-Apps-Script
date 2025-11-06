
import React, { useEffect } from 'react';
import { NotificationState } from '../types';

interface NotificationProps {
  notification: NotificationState | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white font-semibold transition-opacity duration-300';
  const typeClasses = notification.type === 'success' ? 'bg-accent' : 'bg-danger';

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {notification.message}
    </div>
  );
};

export default Notification;
