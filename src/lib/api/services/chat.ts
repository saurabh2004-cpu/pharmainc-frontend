import { baseApi } from "@/lib/api/axios/api";
import { ChatMessage, Conversation } from "@/lib/api/types";

export interface FetchMessagesParams {
  otherUsername: string;
  limit?: number;
  offset?: number;
}

export interface FetchMessagesResponse {
  messages: ChatMessage[];
}

export interface FetchConversationsResponse {
  conversations?: Conversation[];
}

// Function to get auth token from cookies
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

function getAuthToken(): string | null {
  return getCookieValue('token') || getCookieValue('auth-token') || getCookieValue('authToken');
}

export const fetchMessages = async (
  currentUserId: string,
  otherUsername: string,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> => {
  const authToken = getAuthToken();

  const response = await baseApi.get<FetchMessagesResponse>(
    `/api/conversations/${otherUsername}/messages`,
    {
      params: { limit, offset },
      headers: {
        'x-username': currentUserId,
        'Authorization': authToken ? `Bearer ${authToken}` : '',
      }
    }
  );

  return response.data.messages || [];
};

export const fetchConversations = async (
  currentUserId: string
): Promise<Conversation[]> => {
  const authToken = getAuthToken();

  const response = await baseApi.get<Conversation[]>(
    '/api/conversations',
    {
      headers: {
        'x-username': currentUserId,
        'Authorization': authToken ? `Bearer ${authToken}` : '',
      }
    }
  );

  return response.data || [];
};

export const getbaseApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_MSG!;
};
