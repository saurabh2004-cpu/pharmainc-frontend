import axios from 'axios';
import { getAuthToken } from '../utils';
import { Conversation, Message, SendMessagePayload } from '@/types/message';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getHeaders = (isMultipart = false) => {
    const token = getAuthToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
        },
    };
};

export const initiateConversation = async (applicationId: string, message?: string, media?: File) => {
    // Media upload for initiation might need FormData if we support it in one go.
    // The backend `initiateConversation` expects JSON body for message/mediaUrl. 
    // It doesn't seemingly handle file upload directly in that specific controller function in my implementation (I passed mediaUrl).
    // Wait, my backend implementation for initiateConversation:
    // const { applicationId, message, mediaUrl, mediaType } = req.body;
    // It expects mediaUrl. So if we want to send media on initiation, we might need to upload first? 
    // Or simpler: The requirement says "Insert the first message". 
    // For now, let's assume text only for initiation or handle media separately if needed.
    // But the payload can be just JSON.

    return axios.post(`${API_URL}/conversations/initiate`, { applicationId, message }, getHeaders());
};

export const getConversations = async (): Promise<Conversation[]> => {
    const response = await axios.get(`${API_URL}/conversations`, getHeaders());
    return response.data;
};

export const getMessages = async (conversationId: string, page = 1): Promise<Message[]> => {
    const response = await axios.get(`${API_URL}/messages/${conversationId}?page=${page}`, getHeaders());
    return response.data;
};

export const sendMessage = async (payload: SendMessagePayload) => {
    const formData = new FormData();
    formData.append('conversationId', payload.conversationId);
    if (payload.content) formData.append('content', payload.content);
    if (payload.media) formData.append('media', payload.media);
    if (payload.mediaType) formData.append('mediaType', payload.mediaType);

    const response = await axios.post(`${API_URL}/messages`, formData, getHeaders(true));
    return response.data;
};

export const markAsRead = async (conversationId: string) => {
    await axios.patch(`${API_URL}/messages/${conversationId}/read`, {}, getHeaders());
};

export const getUnreadMessagesCount = async (): Promise<number> => {
    const response = await axios.get(`${API_URL}/conversations/unread-count`, getHeaders());
    return response.data.unreadCount;
};
