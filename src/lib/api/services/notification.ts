import { baseApi } from "@/lib/api/axios/api";
import { Notification } from "@/lib/api/types";

/**
 * Fetch all notifications for the authenticated entity
 * Backend automatically resolves the current user/institute from auth context
 */
export const getMyNotifications = async (page = 1, pageSize = 20): Promise<{ notifications: Notification[], total: number, page: number, pageSize: number }> => {
    const response = await baseApi.get("/notifications/my-notifications", {
        params: { page, pageSize }
    });
    return response.data;
};

/**
 * Get unread notification count for the authenticated entity
 */
export const getUnreadCount = async (): Promise<number> => {
    const response = await baseApi.get("/notifications/unread-count");
    console.log("unread messages count", response.data)
    return response.data.count || response.data || 0;
};

/**
 * Mark a single notification as read
 * @param id - Notification ID
 */
export const markNotificationAsRead = async (id: string): Promise<void> => {
    await baseApi.put(`/notifications/${id}/mark-as-read`);
    console.log("mark as read by id", id)
};


/**
 * Mark all notifications as read for the authenticated entity
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
    console.log("Service: calling mark-all-as-read API...");
    try {
        const response = await baseApi.put("/notifications/mark-all-as-read");
        console.log("mark all as read SUCCESS", response.data);
    } catch (error) {
        console.error("Service: mark-all-as-read API FAILED", error);
        throw error;
    }
    return;
};

/**
 * Fetch unread notifications specifically
 */
export const getUnreadNotifications = async (): Promise<Notification[]> => {
    const response = await baseApi.get("/notifications/unread-notifications");
    console.log("unread messages", response.data)
    return response.data.notifications;
};
