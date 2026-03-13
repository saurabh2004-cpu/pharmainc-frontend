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
        console.log("📊 Syncing Unread State:", { count: unreadNotifications?.length });

        if (unreadNotifications?.length > 0 && !currentInstitution?.id) {
          const relevantStatuses = [
            'APPLIED', 'SHORTLISTED', 'NEXT_ROUND_REQUESTED', 'INTERVIEW_SCHEDULED',
            'INTERVIEW_ACCEPTED', 'HIRED', 'REJECTED', 'NEXT_ROUND_REJECTED', 'NEXT_ROUND_ACCEPTED'
          ];

          const mappedPopups = unreadNotifications
            .filter(n => {
              const status = n.status || n.type;
              const isRelevant = relevantStatuses.includes(status || '');
              console.log(`Checking unread notification relevance: id=${n.id}, status=${status}, isRelevant=${isRelevant}`);
              return isRelevant;
            })
            .map(n => ({
              id: n.id,
              type: n.type || n.status || 'info',
              title: n.title,
              message: n.message,
              status: n.status,
              receiverRole: n.receiverRole === 'INSTITUTE' ? 'INSTITUTE' : 'USER',
              applicationId: n.relatedApplicationId || n.application?.id,
              relatedJobId: n.relatedJobId || n.application?.job?.id,
              relatedInstituteId: n.relatedInstituteId || n.application?.job?.institute?.id,
              jobTitle: n.jobTitle || n.application?.job?.title,
              instituteName: n.instituteName || n.application?.job?.institute?.name,
              applicantName: n.application?.user?.firstName ? `${n.application.user.firstName} ${n.application.user.lastName || ''}` : (n.applicantName || n.application?.user?.name),
              interviewType: n.interviewType || n.application?.additionalDetails?.interviewType,
              interviewDate: n.interviewDate || n.application?.additionalDetails?.interviewDate,
              interviewTime: n.interviewTime || n.application?.additionalDetails?.interviewTime,
              interviewLink: n.interviewLink || n.application?.additionalDetails?.interviewLink,
              onClose: removePopup
            }));

          setActivePopups(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPopups = mappedPopups.filter(p => !existingIds.has(p.id));
            console.log("🆕 Adding new unread popups:", newPopups.length);
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
            console.log("🔔 Notification Received:", { 
              status: currentStatus, 
              title: data.title, 
              receiverRole: data.receiverRole,
              applicationId: data.application?.id || data.applicationId
            });

            const additionalDetails = data.application?.additionalDetails as any;
            
            const notification: Notification = {
              ...data,
              id: data.id || Math.random().toString(36).substr(2, 9),
              createdAt: data.createdAt || data.timestamp || new Date().toISOString(),
              receiverId: entityId,
              receiverRole: data.receiverRole || (isInstitute ? 'INSTITUTE' : 'USER'),
              title: data.title || 'New Notification',
              message: data.message || '',
              isRead: data.isRead || false,
              relatedJobId: data.application?.job?.id || data.jobId || data.relatedJobId || null,
              relatedApplicationId: data.application?.id || data.applicationId || data.relatedApplicationId || null,
              relatedInstituteId: data.application?.job?.institute?.id || data.relatedInstituteId || data.job?.institute?.id || null,
              jobTitle: data.application?.job?.title || data.jobTitle || data.application?.job?.title || null,
              instituteName: data.application?.job?.institute?.name || data.instituteName || data.application?.job?.institute?.name || null,
              applicantName: data.application?.user?.firstName ? `${data.application.user.firstName} ${data.application.user.lastName || ''}` : (data.application?.user?.name || data.applicantName || null),
              type: data.type,
              status: currentStatus,
              interviewType: data.interviewType || additionalDetails?.interviewType,
              interviewDate: data.interviewDate || additionalDetails?.interviewDate,
              interviewTime: data.interviewTime || additionalDetails?.interviewTime,
              interviewLink: data.interviewLink || additionalDetails?.interviewLink
            };

            if (isInstitute && !notification.applicantName && (data.applicantId || data.userId)) {
              try {
                const idToFetch = data.applicantId || data.userId;
                const user = await getUserById(idToFetch);
                if (user) {
                  notification.applicantName = user.name;
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
                const relevantStatuses = [
                  'APPLIED', 'SHORTLISTED', 'NEXT_ROUND_REQUESTED', 'INTERVIEW_SCHEDULED',
                  'INTERVIEW_ACCEPTED', 'HIRED', 'REJECTED', 'NEXT_ROUND_REJECTED', 'NEXT_ROUND_ACCEPTED'
                ];
                
                console.log(`[onNotification] Checking relevance: status=${status}, role=${notification.receiverRole}, isRelevant=${relevantStatuses.includes(status)}`);
                
                if (relevantStatuses.includes(status) && !isInstitute) {
                  console.log(`[onNotification] Adding POPUP for ${status}`);
                  setActivePopups(prev => [{
                    id: notification.id,
                    type: notification.type || status || 'info',
                    title: notification.title,
                    message: notification.message,
                    status: status,
                    receiverRole: notification.receiverRole === 'INSTITUTE' ? 'INSTITUTE' : 'USER',
                    applicationId: notification.relatedApplicationId,
                    relatedJobId: notification.relatedJobId,
                    relatedInstituteId: notification.relatedInstituteId,
                    jobTitle: notification.jobTitle,
                    instituteName: notification.instituteName,
                    applicantName: notification.applicantName,
                    interviewType: notification.interviewType,
                    interviewDate: notification.interviewDate,
                    interviewTime: notification.interviewTime,
                    interviewLink: notification.interviewLink,
                    onClose: removePopup
                  }, ...prev]);
                }
                
                // Also conditionally show toast based on role
                if (!isInstitute) {
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
