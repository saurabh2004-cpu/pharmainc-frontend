"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { useUserStore, useInstitutionStore, useNotificationStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'
import { connectSocket } from '@/lib/socket'
import { toast } from "sonner"
import { getUserById } from '@/lib/api'
import { Notification } from '@/lib/api/types'
import { NotificationStack } from './notifications/NotificationStack'
import { markNotificationAsRead } from '@/lib/api/services/notification'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUserStore()
  const { currentInstitution } = useInstitutionStore()
  const {
    fetchNotifications,
    addOptimisticNotification,
    fetchUnreadCount,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead
  } = useNotificationStore()
  const processedIds = useRef(new Set<string>()) // Track processed notification IDs session-wise
  const [activePopups, setActivePopups] = useState<any[]>([])

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, [markAsRead]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      setActivePopups([]); // Clear popups immediately
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, [markAllAsRead]);

  const removePopup = useCallback((id: string) => {
    setActivePopups(prev => prev.filter(p => p.id !== id));
    // Mark as read when closing the popup
    handleMarkAsRead(id);
  }, [handleMarkAsRead]);

  const handleActionComplete = useCallback((id: string) => {
    // Logic when an action (Accept/Reject) is completed in the popup
    handleMarkAsRead(id);
  }, [handleMarkAsRead]);


  useEffect(() => {
    let socket: any = null;

    const syncUnreadState = async () => {
      try {
        const unreadNotifications = await fetchUnreadNotifications();
        if (unreadNotifications?.length > 0 && !currentInstitution?.id) {
          const mappedPopups = unreadNotifications.map(n => ({
            id: n.id,
            type: n.type || n.status || 'info',
            title: n.title,
            message: n.message,
            status: n.status,
            receiverRole: n.receiverRole === 'INSTITUTE' ? 'INSTITUTE' : 'USER',
            applicationId: n.relatedApplicationId,
            onClose: removePopup
          }));

          setActivePopups(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPopups = mappedPopups.filter(p => !existingIds.has(p.id));
            newPopups.forEach(p => processedIds.current.add(p.id));
            return [...prev, ...newPopups];
          });
        }
        // Ensure count is synced
        await fetchUnreadCount();
      } catch (e) {
        console.error("Failed to sync unread state:", e);
      }
    };

    const initializeNotifications = async () => {
      const token = getAuthToken()
      const entityId = currentInstitution?.id || currentUser?.id;
      const isInstitute = !!currentInstitution?.id;

      if (token && entityId) {
        // Initial fetch
        await fetchNotifications();
        await syncUnreadState();

        socket = connectSocket(token);

        if (socket) {
          // Join room based on entity type
          if (isInstitute) {
            console.log("Joining socket room for institute:", entityId);
            socket.emit('join', { instituteId: entityId });
          } else {
            console.log("Joining socket room for user:", entityId);
            socket.emit('join', { userId: entityId });
          }

          // Re-sync on reconnect
          socket.on('connect', () => {
            console.log("Socket connected/reconnected. Syncing unread state...");
            syncUnreadState();
          });

          socket.on('notification', async (data: any, statusPayload?: any) => {
            console.log("Socket Notification received:", { data, statusPayload });

            // Use status from payload if available, otherwise fall back to type or infer from data
            const currentStatus = statusPayload || data.status || data.type;

            // Transform socket notification to match Notification type
            const notification: Notification = {
              id: data.id || Math.random().toString(36).substr(2, 9),
              createdAt: data.timestamp || new Date().toISOString(),
              receiverId: entityId,
              receiverRole: data.receiverRole || (isInstitute ? 'INSTITUTE' : 'USER'),
              title: data.title || 'New Notification',
              message: data.message || '',
              isRead: false,
              relatedJobId: data.jobId || data.relatedJobId || null,
              relatedApplicationId: data.applicationId || data.relatedApplicationId || null,
              type: data.type,
              status: currentStatus
            };

            // Enrich with user details if it's an institute receiving application notifications
            if (isInstitute && !data.applicantName && (data.applicantId || data.userId)) {
              try {
                const idToFetch = data.applicantId || data.userId;
                const user = await getUserById(idToFetch);
                if (user) {
                  const applicantName = user.name;
                  // Update message if it contains the ID
                  if (notification.message && notification.message.includes(idToFetch)) {
                    notification.message = notification.message.replace(idToFetch, applicantName);
                  }
                }
              } catch (e) {
                console.error("Failed to fetch applicant details:", e);
              }
            }

            // Add to store optimistically
            addOptimisticNotification(notification);

            // Force fetch unread count to ensure accuracy
            fetchUnreadCount();

            // Toast Logic Based on Role
            // Check if we already processed this ID for toast
            if (processedIds.current.has(notification.id)) {
              return;
            }
            processedIds.current.add(notification.id);

            // Use status from payload if available, otherwise fall back to type or infer from data
            const status = statusPayload || data.status || data.type;

            if (notification.message) {
              if (isInstitute) {
                // Institute: show user actions (APPLIED, responses)
                // For institute, we generally just show toasts for now
                toast.info(notification.message);
              } else {
                // Job Seekers: show institute actions (requests, decisions)
                const relevantStatuses = [
                  'SHORTLISTED',
                  'NEXT_ROUND_REQUESTED',
                  'INTERVIEW_SCHEDULED',
                  'INTERVIEW_ACCEPTED',
                  'HIRED',
                  'REJECTED',
                  'NEXT_ROUND_REJECTED'
                ];

                // Check specifically for statuses that require a popup with actions or clear info
                if (relevantStatuses.includes(status)) {
                  console.log("Adding Popup:", notification);
                  setActivePopups(prev => [{
                    id: notification.id,
                    type: notification.type || notification.status || 'info',
                    title: notification.title,
                    message: notification.message,
                    status: notification.status,
                    receiverRole: notification.receiverRole === 'INSTITUTE' ? 'INSTITUTE' : 'USER',
                    applicationId: notification.relatedApplicationId,
                    onClose: removePopup
                  }, ...prev]);
                }

                // Show Toast as well
                toast.info(notification.message);
              }
            }
          });
        }
      }
    }

    initializeNotifications()

    return () => {
      if (socket) {
        socket.off('notification');
        socket.off('connect');
      }
    }
  }, [currentUser?.id, currentInstitution?.id, fetchNotifications, addOptimisticNotification, fetchUnreadCount, fetchUnreadNotifications, removePopup])

  return (
    <>
      {children}
      <NotificationStack
        notifications={activePopups}
        onClose={removePopup}
        onCloseAll={handleMarkAllAsRead}
        onActionComplete={handleActionComplete}
      />
    </>
  )
}
