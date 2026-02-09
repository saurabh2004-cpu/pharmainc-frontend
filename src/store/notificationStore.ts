import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Notification } from '@/lib/api/types'
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead as apiMarkAsRead,
  markAllNotificationsAsRead as apiMarkAllAsRead
} from '@/lib/api/services/notification'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  lastFetchTime: number | null

  // Actions
  fetchNotifications: () => Promise<void>
  fetchUnreadCount: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearNotifications: () => void
  addOptimisticNotification: (notification: Notification) => boolean
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
        lastFetchTime: null,

        fetchNotifications: async () => {
          set({ loading: true, error: null })

          try {
            const notifications = await getMyNotifications()

            // Sort by createdAt descending (latest first)
            const sortedNotifications = notifications.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            set({
              notifications: sortedNotifications,
              loading: false,
              lastFetchTime: Date.now()
            })

            // Also update unread count
            await get().fetchUnreadCount()
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
          // Store previous state for rollback
          const previousNotifications = get().notifications
          const previousUnreadCount = get().unreadCount

          // Optimistic update
          set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            unreadCount: 0
          }))

          try {
            await apiMarkAllAsRead()
          } catch (error: any) {
            console.error('Failed to mark all notifications as read:', error)

            // Revert on failure
            set({
              notifications: previousNotifications,
              unreadCount: previousUnreadCount,
              error: 'Failed to mark all notifications as read'
            })
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
