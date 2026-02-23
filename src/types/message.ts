export interface Conversation {
    id: string;
    participant: {
        id: string;
        name?: string;
        firstName?: string;
        lastName?: string;
        profile_picture?: string;
        role?: string;
    };
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderType: 'USER' | 'INSTITUTE';
    senderId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'VIDEO' | 'PDF';
    isRead: boolean;
    createdAt: string;
}

export interface SendMessagePayload {
    conversationId: string;
    content?: string;
    media?: File;
    mediaType?: 'IMAGE' | 'VIDEO' | 'PDF';
}
