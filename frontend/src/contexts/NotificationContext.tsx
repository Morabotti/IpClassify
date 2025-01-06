import { useState, createContext, ReactNode } from 'react';
import { NotificationSettings, NotificationType } from '@types';
import { Box, Collapse } from '@mui/material';
import { createSx } from '@theme';
import { Notification } from '@components/common';
import { TransitionGroup } from 'react-transition-group';

const sx = createSx({
  container: {
    position: 'fixed',
    top: 8,
    right: 8,
    zIndex: t => t.zIndex.modal + 50,
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }
});

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timer?: NodeJS.Timeout;
}

const defaultNotificationOptions: NotificationSettings = {
  maxNotifications: 3,
  autoHideDuration: 5000,
  preventDuplicate: false
};

interface NotificationContext {
  createNotification: (message: string, type: NotificationType, opts?: Partial<NotificationSettings>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Props {
  children: ReactNode;
  settings?: Partial<NotificationSettings>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationContext | null>(null);

export const NotificationProvider = ({ children, settings = {} }: Props): ReactNode => {
  const notificationSettings = { ...defaultNotificationOptions, ...settings };
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const createNotification = (message: string, type: NotificationType, opts?: Partial<NotificationSettings>) => {
    setNotifications(prev => {
      const settings = { ...notificationSettings, ...(opts ?? {}) };

      if (settings.preventDuplicate) {
        const isDuplicate = prev.some(n => n.message === message && n.type === type);
        if (isDuplicate) return prev;
      }

      const id = Date.now().toString();

      const newNotification: Notification = { id, message, type };
      const updated = [...prev, newNotification];

      if (updated.length > settings.maxNotifications) {
        const oldest = updated.shift();
        if (oldest?.timer) clearTimeout(oldest.timer);
      }

      if (settings.autoHideDuration !== null) {
        newNotification.timer = setTimeout(() => {
          removeNotification(id);
        }, settings.autoHideDuration);
      }

      return updated;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const notificationToRemove = prev.find(n => n.id === id);
      if (notificationToRemove?.timer) clearTimeout(notificationToRemove.timer);
      return prev.filter(n => n.id !== id);
    });
  };

  const clearNotifications = () => {
    setNotifications(prev => {
      for (const n of prev) {
        if (n.timer) clearTimeout(n.timer);
      }
      return [];
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        createNotification,
        clearNotifications,
        removeNotification
      }}
    >
      {children}
      <Box sx={sx.container}>
        <TransitionGroup>
          {notifications.map(notification => (
            <Collapse key={notification.id}>
              <Notification
                message={notification.message}
                onClose={() => removeNotification(notification.id)}
                type={notification.type}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      </Box>
    </NotificationContext.Provider>
  );
};
