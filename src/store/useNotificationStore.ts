import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, NotificationType } from '../types';

interface NotificationState {
  notifications: Notification[];

  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    userId: string,
    entityType?: string,
    entityId?: string
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  getUnread: () => Notification[];
  clearOld: (daysOld: number) => void;
}

let idCounter = 0;
function generateNotificationId(): string {
  idCounter += 1;
  return `notif-${Date.now()}-${idCounter}`;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (type, title, message, userId, entityType?, entityId?) => {
        const notification: Notification = {
          id: generateNotificationId(),
          type,
          title,
          message,
          entityType,
          entityId,
          userId,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notifications: [notification, ...state.notifications] }));
      },

      markRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      getUnread: () => {
        return get().notifications.filter((n) => !n.read);
      },

      clearOld: (daysOld) => {
        const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
        set((state) => ({
          notifications: state.notifications.filter(
            (n) => new Date(n.createdAt).getTime() > cutoff
          ),
        }));
      },
    }),
    { name: 'qatrial:notifications' }
  )
);
