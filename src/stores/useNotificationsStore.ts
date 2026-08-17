import { create } from 'zustand';
import type { NotificationType } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

interface NotificationState {
  notifications: Array<NotificationType>;
  actions: {
    pushNotification: (notification: Omit<NotificationType, 'id'>) => void;
    removeNotification: (id: string) => void;
  };
}

const useNotificationStore = create<NotificationState>(set => ({
  notifications: [],
  actions: {
    pushNotification: (notification: Omit<NotificationType, 'id'>) => {
      set(state => {
        if (state.notifications.at(-1) && state.notifications.at(-1)!.msg === notification.msg)
          return { notifications: state.notifications };

        return {
          notifications: state.notifications.concat({ ...notification, id: uuidv4() }),
        };
      });
    },
    removeNotification: (id: string) =>
      set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })),
  },
}));

export const useNotifications = () => useNotificationStore(state => state.notifications);
export const useNotificationActions = () => useNotificationStore(state => state.actions);
