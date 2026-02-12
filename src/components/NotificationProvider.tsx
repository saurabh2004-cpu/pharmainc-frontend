"use client"

import { useEffect, useRef } from 'react'
import { useUserStore, useInstitutionStore, useNotificationStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'
import { connectSocket } from '@/lib/socket'
import { toast } from "sonner"
import { getUserById } from '@/lib/api'
import { Notification } from '@/lib/api/types'
import { NotificationStack } from './notifications/NotificationStack'
import { useState } from 'react'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUserStore()
  const { currentInstitution } = useInstitutionStore()
  const { fetchNotifications, addOptimisticNotification, fetchUnreadCount } = useNotificationStore()
  const processedIds = useRef(new Set<string>()) // Track processed notification IDs session-wise
  const mountTime = useRef(Date.now())
  const [activePopups, setActivePopups] = useState<any[]>([])

  const removePopup = (id: string) => {
    setActivePopups(prev => prev.filter(p => p.id !== id))
  }

  // Debug: Show a test popup on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Triggering TEST popup");
      setActivePopups(prev => [{
        id: 'test-1',
        type: 'NEXT_ROUND_REQUESTED',
        title: 'Test Notification',
        message: 'This is a test notification to verify popup rendering.',
        status: 'NEXT_ROUND_REQUESTED',
        applicationId: 'test-app-id',
        onClose: removePopup
      }, ...prev]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let socket: any = null;

    const initializeNotifications = async () => {
      const token = getAuthToken()
      const entityId = currentInstitution?.id || currentUser?.id;
      const isInstitute = !!currentInstitution?.id;

      if (token && entityId) {
        // Fetch persisted notifications from backend
        await fetchNotifications()
        await fetchUnreadCount()

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

          socket.on('notification', async (data: any) => {
            console.log("Socket Notification:", data);

            // Transform socket notification to match Notification type
            const notification: Notification = {
              id: data.id || Math.random().toString(36).substr(2, 9),
              createdAt: data.timestamp || new Date().toISOString(),
              receiverId: entityId,
              receiverRole: isInstitute ? (currentInstitution?.role || 'INSTITUTE') : (currentUser?.role || 'USER'),
              title: data.title || 'New Notification',
              message: data.message || '',
              isRead: false,
              relatedJobId: data.jobId || data.relatedJobId || null,
              relatedApplicationId: data.applicationId || data.relatedApplicationId || null,
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

            // Toast Logic Based on Role
            // Check if we already processed this ID for toast
            if (processedIds.current.has(notification.id)) {
              return;
            }
            processedIds.current.add(notification.id);

            if (notification.message) {
              const status = data.status || data.type;

              if (isInstitute) {
                // Institute: show user actions (APPLIED, responses)
                const isUserAction = ['APPLIED', 'NEXT_ROUND_ACCEPTED', 'NEXT_ROUND_REJECTED'].includes(status);
                if (isUserAction || !status) {
                  toast.info(notification.message);
                }
              } else {
                // Job Seekers: show institute actions (requests, decisions)
                const relevantStatuses = [
                  'SHORTLISTED',
                  'NEXT_ROUND_REQUESTED',
                  'INTERVIEW_SCHEDULED',
                  'INTERVIEW_ACCEPTED',
                  'HIRED',
                  'REJECTED',
                  'NEXT_ROUND_ACCEPTED',
                  'NEXT_ROUND_REJECTED'
                ];

                console.log("Checking popup condition:", { status, relevant: relevantStatuses.includes(status) });

                // 1. Show Horizontal Popup for relevant statuses
                if (relevantStatuses.includes(status)) {
                  console.log("Adding Popup:", notification);
                  setActivePopups(prev => [{
                    id: notification.id,
                    type: status,
                    title: notification.title,
                    message: notification.message,
                    status: status,
                    applicationId: notification.relatedApplicationId,
                    onClose: removePopup
                  }, ...prev]);
                } else {
                  console.warn("Status not relevant for popup:", status);
                }

                // 2. Show Standard Toast (Simultaneously as requested)
                if (relevantStatuses.includes(status) || !status) {
                  toast.info(notification.message);
                }
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
      }
    }
  }, [currentUser?.id, currentInstitution?.id, fetchNotifications, addOptimisticNotification, fetchUnreadCount])

  return (
    <>
      {children}
      <NotificationStack notifications={activePopups} onClose={removePopup} />
    </>
  )
}
