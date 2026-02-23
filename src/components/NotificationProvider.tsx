"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { useUserStore, useInstitutionStore, useNotificationStore } from '@/store'
import { useChatStore } from '@/store/chatStore'
import { getAuthToken } from '@/lib/api/utils'
import { connectSocket } from '@/lib/socket'
import { toast } from "sonner"
import { getUserById } from '@/lib/api'
import { Notification } from '@/lib/api/types'
import { NotificationStack } from './notifications/NotificationStack'

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
  const { fetchUnreadCount: fetchUnreadMessagesCount, incrementUnreadCount } = useChatStore()
  const processedIds = useRef(new Set<string>())
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
      setActivePopups([]);
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, [markAllAsRead]);

  const removePopup = useCallback((id: string) => {
    setActivePopups(prev => prev.filter(p => p.id !== id));
    handleMarkAsRead(id);
  }, [handleMarkAsRead]);

  const handleActionComplete = useCallback((id: string) => {
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
        await fetchUnreadCount();
        await fetchUnreadMessagesCount();
      } catch (e) {
        console.error("Failed to sync unread state:", e);
      }
    };

    const initializeNotifications = async () => {
      const token = getAuthToken()
      const entityId = currentInstitution?.id || currentUser?.id;
      const isInstitute = !!currentInstitution?.id;

      if (token && entityId) {
        await fetchNotifications();
        await syncUnreadState();

        socket = connectSocket(token);

        if (socket) {
          if (isInstitute) {
            socket.emit('join', { instituteId: entityId });
          } else {
            socket.emit('join', { userId: entityId });
          }

          const onConnect = () => {
            syncUnreadState();
          };

          const onNewMessage = (message: any) => {
            console.log("Global New message received:", message);
            if (message.senderId !== entityId) {
              incrementUnreadCount();
              fetchUnreadMessagesCount();
            }
          };

          const onNewConversation = (conversation: any) => {
            console.log("Global New conversation received:", conversation);
            fetchUnreadMessagesCount();
          };

          const onMessagesRead = () => {
            fetchUnreadMessagesCount();
          };

          const onNotification = async (data: any, statusPayload?: any) => {
            const currentStatus = statusPayload || data.status || data.type;
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

            if (isInstitute && !data.applicantName && (data.applicantId || data.userId)) {
              try {
                const idToFetch = data.applicantId || data.userId;
                const user = await getUserById(idToFetch);
                if (user) {
                  const applicantName = user.name;
                  if (notification.message && notification.message.includes(idToFetch)) {
                    notification.message = notification.message.replace(idToFetch, applicantName);
                  }
                }
              } catch (e) {
                console.error("Failed to fetch applicant details:", e);
              }
            }

            addOptimisticNotification(notification);
            fetchUnreadCount();

            if (processedIds.current.has(notification.id)) return;
            processedIds.current.add(notification.id);

            const status = statusPayload || data.status || data.type;

            if (notification.message) {
              if (isInstitute) {
                toast.info(notification.message);
              } else {
                const relevantStatuses = [
                  'SHORTLISTED', 'NEXT_ROUND_REQUESTED', 'INTERVIEW_SCHEDULED',
                  'INTERVIEW_ACCEPTED', 'HIRED', 'REJECTED', 'NEXT_ROUND_REJECTED'
                ];
                if (relevantStatuses.includes(status)) {
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
                toast.info(notification.message);
              }
            }
          };

          socket.on('connect', onConnect);
          socket.on('new_message', onNewMessage);
          socket.on('new_conversation', onNewConversation);
          socket.on('messages_read', onMessagesRead);
          socket.on('notification', onNotification);

          return () => {
            socket.off('connect', onConnect);
            socket.off('new_message', onNewMessage);
            socket.off('new_conversation', onNewConversation);
            socket.off('messages_read', onMessagesRead);
            socket.off('notification', onNotification);
          };
        }
      }
    };

    let cleanupFn: (() => void) | void;
    initializeNotifications().then(cleanup => {
      cleanupFn = cleanup;
    });

    return () => {
      if (cleanupFn) cleanupFn();
    }
  }, [currentUser?.id, currentInstitution?.id, fetchNotifications, addOptimisticNotification, fetchUnreadCount, fetchUnreadNotifications, removePopup, fetchUnreadMessagesCount, incrementUnreadCount])

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
