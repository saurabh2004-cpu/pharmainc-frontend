import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Notification } from '@/lib/api/types'
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead as apiMarkAsRead,
  markAllNotificationsAsRead as apiMarkAllAsRead,
  getUnreadNotifications
} from '@/lib/api/services/notification'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  page: number
  hasMore: boolean
  total: number
  lastFetchTime: number | null

  // Actions
  fetchNotifications: (page?: number) => Promise<void>
  fetchUnreadCount: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearNotifications: () => void
  addOptimisticNotification: (notification: Notification) => boolean
  fetchUnreadNotifications: () => Promise<Notification[]>
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [] as Notification[],
        unreadCount: 0,
        loading: false,
        error: null,
        lastFetchTime: null,
        page: 1,
        hasMore: true,
        total: 0,

        fetchNotifications: async (page = 1) => {
          set({ loading: true, error: null })

          try {
            const pageSize = 20;
            const response = await getMyNotifications(page, pageSize);
            const { notifications, total } = response;

            // Sort by createdAt descending (latest first)
            const sortedNotifications = notifications.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            set((state) => ({
              notifications: page === 1 ? sortedNotifications : [...state.notifications, ...sortedNotifications],
              total,
              page,
              hasMore: state.notifications.length + sortedNotifications.length < total,
              loading: false,
              lastFetchTime: Date.now()
            }))

            // Also update unread count on first fetch
            if (page === 1) {
              await get().fetchUnreadCount()
            }
          } catch (error: any) {
            console.error('Failed to fetch notifications:', error)
            set({
              error: error?.response?.data?.message || 'Failed to load notifications',
              loading: false
            })
          }
        },

        fetchUnreadCount: async () => {
          try {
            const count = await getUnreadCount()
            set({ unreadCount: count })
          } catch (error: any) {
            console.error('Failed to fetch unread count:', error)
            // Don't set error state for count fetch failures
          }
        },

        markAsRead: async (id: string) => {
          // Optimistic update
          set((state) => ({
            notifications: state.notifications.map(n =>
              n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }))

          try {
            await apiMarkAsRead(id)
            // Optionally refetch to ensure consistency
            // await get().fetchUnreadCount()
          } catch (error: any) {
            console.error('Failed to mark notification as read:', error)

            // Revert optimistic update on failure
            set((state) => ({
              notifications: state.notifications.map(n =>
                n.id === id ? { ...n, isRead: false } : n
              ),
              unreadCount: state.unreadCount + 1,
              error: 'Failed to mark notification as read'
            }))
          }
        },

        markAllAsRead: async () => {
          console.log("Store: markAllAsRead action START");
          const previousNotifications = get().notifications;
          const previousUnreadCount = get().unreadCount;

          set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            unreadCount: 0
          }));

          try {
            console.log("Store: triggering API call...");
            await apiMarkAllAsRead();
            console.log("Store: API call completed successfully");
          } catch (error: any) {
            console.error('Store: API call FAILED', error);
            set({
              notifications: previousNotifications,
              unreadCount: previousUnreadCount,
              error: 'Failed to mark all notifications as read'
            });
          }
        },

        clearNotifications: () => {
          set({
            notifications: [],
            unreadCount: 0,
            error: null,
            lastFetchTime: null
          })
        },

        addOptimisticNotification: (notification: Notification) => {
          const exists = get().notifications.some((n) => n.id === notification.id)
          if (exists) return false

          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
          }))
          return true
        },

        fetchUnreadNotifications: async () => {
          try {
            const notifications = await getUnreadNotifications();
            // We don't necessarily need to replace 'notifications' state here, 
            // as that might be paginated 'my-notifications'.
            // But we should update unread count.
            set({ unreadCount: notifications.length });
            return notifications;
          } catch (error) {
            console.error("Failed to fetch unread notifications app:", error);
            return [];
          }
        }
      }),
      {
        name: 'notification-store',
        partialize: (state) => ({
          notifications: state.notifications,
          unreadCount: state.unreadCount,
          lastFetchTime: state.lastFetchTime
        }),
      }
    ),
    {
      name: 'notification-store'
    }
  )
)
