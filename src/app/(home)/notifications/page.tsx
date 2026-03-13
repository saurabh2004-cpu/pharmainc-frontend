"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bell, MessageCircle, ArrowLeft } from "lucide-react"
import { NotificationItem } from './_components/NotificationItem'
import { LoginPrompt } from './_components/LoginPrompt'
import { useNotificationStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'
import { useCurrentEntity } from '@/lib/utils/entityUtils'
import { requestNextRound, respondToNextRound } from '@/lib/api/services/application'
import { toast } from "sonner"

const NotificationsPage = () => {
  console.log("NotificationsPage rendering");
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { currentEntity, isLoading, userType } = useCurrentEntity()
  const {
    notifications,
    unreadCount,
    loading: notificationLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    hasMore,
    page
  } = useNotificationStore()

  // Combine notifications
  const generalNotificationsList = notifications || [];
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      // ... existing auth check logic ...
      if (token) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const [activeTab, setActiveTab] = useState("all")

  // Initial fetch
  useEffect(() => {
    const fetchPersistedNotifications = async () => {
      if (!isAuthenticated) return
      // Only fetch if we have no notifications or just starting
      if (generalNotificationsList.length === 0) {
        await fetchNotifications(1)
      }
    }

    if (isAuthenticated) {
      fetchPersistedNotifications()
    }
  }, [isAuthenticated, fetchNotifications]) // Removed generalNotificationsList.length dependency to avoid loops

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !notificationLoading) {
          console.log("Loading more notifications, page:", page + 1);
          fetchNotifications(page + 1)
        }
      },
      { threshold: 0.5 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [hasMore, notificationLoading, fetchNotifications, page])

  // Mark all notifications as read when user views the page and "all" tab is active
  useEffect(() => {
    const markRead = async () => {
      console.log("NotificationsPage markRead effect executing", { isAuthenticated, unreadCount, activeTab });
      if (isAuthenticated && activeTab === "all") {
        console.log("Calling markAllAsRead from effect");
        await markAllAsRead();
      }
    };
    if (isAuthenticated) {
      markRead();
    }
  }, [isAuthenticated, activeTab, markAllAsRead]);

  // Connection requests are handled separately - this is for persisted notifications only
  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleNextRoundAccept = async (notificationId: string, applicationId: string) => {
    try {
      await respondToNextRound(applicationId, 'accept');
      toast.success("Accepted next round request");
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept request");
      throw error;
    }
  }

  const handleNextRoundReject = async (notificationId: string, applicationId: string) => {
    try {
      await respondToNextRound(applicationId, 'reject');
      toast.success("Rejected next round request");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject request");
      throw error;
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Notifications</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }



  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Notifications</h1>
          {/*<button
            onClick={() => {
              console.log("Debug Button clicked");
              markAllAsRead();
            }}
            className="text-xs bg-red-100 p-1"
          >
            DEBUG: Mark All Read
          </button>*/}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="p-4 border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-2 bg-gray-50 border border-gray-200 rounded-full p-1">
            <TabsTrigger
              value="all"
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Bell className="w-4 h-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <MessageCircle className="w-4 h-4" />
              <span>General</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent value="all" className="">
            <div className="bg-white">
              {notificationLoading && generalNotificationsList.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div className="text-sm text-gray-600">Loading notifications...</div>
                  </div>
                </div>
              ) : generalNotificationsList.length > 0 ? (
                <div className="flex flex-col">
                  {generalNotificationsList.map((notification, index) => (
                    <div key={notification.id || index} onClick={() => handleNotificationClick(notification.id)}>
                      <NotificationItem
                        id={notification.id}
                        type={notification.receiverRole}
                        title={notification.title}
                        message={notification.message}
                        timestamp={notification.createdAt}
                        time={formatTimeAgo(notification.createdAt)}
                        read={notification.isRead}
                        relatedJobId={notification.application?.job?.id || notification.relatedJobId}
                        relatedApplicationId={notification.application?.id || notification.relatedApplicationId}
                        relatedInstituteId={notification.application?.job?.institute?.id || notification.relatedInstituteId}
                        status={notification.status || notification.application?.status}
                        jobTitle={notification.application?.job?.title}
                        instituteName={notification.application?.job?.institute?.name}
                        applicantName={notification.application?.user?.name}
                        applicationId={notification.application?.id || notification.relatedApplicationId || undefined}
                        interviewType={notification.interviewType || (notification.application?.additionalDetails as any)?.interviewType}
                        interviewDate={notification.interviewDate || (notification.application?.additionalDetails as any)?.interviewDate}
                        interviewTime={notification.interviewTime || (notification.application?.additionalDetails as any)?.interviewTime}
                        interviewLink={notification.interviewLink || (notification.application?.additionalDetails as any)?.interviewLink}
                      />
                    </div>
                  ))}
                  <div ref={loadMoreRef} className="h-4 w-full flex justify-center p-4">
                    {notificationLoading && hasMore && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No notifications yet</h3>
                  <p className="text-gray-400 text-center max-w-sm">We'll notify you when something happens</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="general" className="">
            <div className="bg-white">
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No general notifications</h3>
                <p className="text-gray-400 text-center max-w-sm">Activity notifications will appear here</p>
              </div>
            </div>
          </TabsContent>


        </div>
      </Tabs>
    </div>
  )
}

export default NotificationsPage;
