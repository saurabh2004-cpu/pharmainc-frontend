import { baseApi } from "@/lib/api/axios/api";
import { Notification } from "@/lib/api/types";

/**
 * Fetch all notifications for the authenticated entity
 * Backend automatically resolves the current user/institute from auth context
 */
export const getMyNotifications = async (): Promise<Notification[]> => {
    const response = await baseApi.get("/notifications/my-notifications");
    return response.data;
};

/**
 * Get unread notification count for the authenticated entity
 */
export const getUnreadCount = async (): Promise<number> => {
    const response = await baseApi.get("/notifications/unread-count");
    return response.data.count || response.data || 0;
};

/**
 * Mark a single notification as read
 * @param id - Notification ID
 */
export const markNotificationAsRead = async (id: string): Promise<void> => {
    await baseApi.put(`/notifications/${id}/mark-as-read`);
};

/**
 * Mark all notifications as read for the authenticated entity
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
    await baseApi.put("/notifications/mark-all-as-read");
};
