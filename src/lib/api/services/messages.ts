import axios from 'axios';
import { getAuthToken } from '../utils';
import { Conversation, Message, SendMessagePayload } from '@/types/message';

const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

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
    return axios.post(`${API_URL}/api/v1/conversations/initiate`, { applicationId, message }, getHeaders());
};

export const getConversations = async (): Promise<Conversation[]> => {
    const response = await axios.get(`${API_URL}/api/v1/conversations`, getHeaders());
    return response.data;
};

export const getMessages = async (conversationId: string, page = 1): Promise<Message[]> => {
    const response = await axios.get(`${API_URL}/api/v1/messages/${conversationId}?page=${page}`, getHeaders());
    return response.data;
};

export const sendMessage = async (payload: SendMessagePayload) => {
    const formData = new FormData();
    formData.append('conversationId', payload.conversationId);
    if (payload.content) formData.append('content', payload.content);
    if (payload.media) formData.append('media', payload.media);
    if (payload.mediaType) formData.append('mediaType', payload.mediaType);

    const response = await axios.post(`${API_URL}/api/v1/messages`, formData, getHeaders(true));
    return response.data;
};

export const sendVoiceMessage = async (conversationId: string, audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('conversationId', conversationId);
    formData.append('audio', audioBlob, 'voice-message.webm');

    const response = await axios.post(`${API_URL}/api/v1/messages/voice`, formData, getHeaders(true));
    return response.data;
};

export const markAsRead = async (conversationId: string) => {
    await axios.patch(`${API_URL}/api/v1/messages/${conversationId}/read`, {}, getHeaders());
};

export const getUnreadMessagesCount = async (): Promise<number> => {
    const response = await axios.get(`${API_URL}/api/v1/conversations/unread-count`, getHeaders());
    return response.data.unreadCount;
};
