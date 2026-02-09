import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from './userStore'
import { fetchMessages as fetchMessagesService, fetchConversations as fetchConversationsService } from '@/lib/api/services/chat'
import { ChatUser, ChatMessage, Conversation } from '@/lib/api/types'
import { getCurrentEntity } from '@/lib/utils/entityUtils'
import { getUserType } from '@/lib/api'

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

interface ChatStore {
  selectedChat: ChatUser | null
  setSelectedChat: (user: ChatUser | null) => void

  socket: Socket | null
  isConnected: boolean
  onlineUsers: Set<string>

  conversations: Conversation[]
  messages: Record<string, ChatMessage[]>

  connect: (userId: string) => void
  disconnect: () => void

  sendMessage: (recipientUsername: string, content: string, replyTo?: string) => void
  fetchMessages: (currentUserId: string, otherUsername: string, limit?: number, offset?: number) => Promise<void>
  fetchConversations: (currentUserId: string) => Promise<void>

  setMessages: (conversationKey: string, messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  confirmLatestTemporaryMessage: (messageId: string, timestamp: string, delivered: boolean) => void
  setConversations: (conversations: Conversation[]) => void
  setOnlineUsers: (users: string[]) => void
  addOnlineUser: (userId: string) => void
  removeOnlineUser: (userId: string) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  selectedChat: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  conversations: [],
  messages: {},

  setSelectedChat: (user) => set({ selectedChat: user }),
  setMessages: (conversationKey, messages) =>
    set(state => ({
      messages: { ...state.messages, [conversationKey]: messages }
    })),
  addMessage: (message) =>
    set(state => {
      const conversationKey = [message.senderUsername, message.recipientUsername].sort().join('_')
      const existingMessages = state.messages[conversationKey] || []
      return {
        messages: {
          ...state.messages,
          [conversationKey]: [...existingMessages, message]
        }
      }
    }),
  confirmLatestTemporaryMessage: (messageId, timestamp, delivered) =>
    set(state => {
      const updatedMessages = { ...state.messages }
      let foundAndUpdated = false

      Object.keys(updatedMessages).forEach(conversationKey => {
        if (foundAndUpdated) return

        const messages = updatedMessages[conversationKey]
        // Find the latest temporary message (search from end)
        for (let i = messages.length - 1; i >= 0; i--) {
          const msg = messages[i]
          if (msg.tempId && msg.sending) {
            // Replace temporary message with confirmed message
            updatedMessages[conversationKey] = [...messages]
            updatedMessages[conversationKey][i] = {
              ...msg,
              id: messageId,
              timestamp,
              sending: false,
              tempId: undefined // Remove temp properties
            }
            foundAndUpdated = true
            break
          }
        }
      })

      return { messages: updatedMessages }
    }),
  setConversations: (conversations) => set({ conversations }),
  setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),
  addOnlineUser: (userId) =>
    set(state => ({
      onlineUsers: new Set([...state.onlineUsers, userId])
    })),
  removeOnlineUser: (userId) =>
    set(state => {
      const newSet = new Set(state.onlineUsers)
      newSet.delete(userId)
      return { onlineUsers: newSet }
    }),

  connect: (userId: string) => {
    const { socket } = get()

    if (socket?.connected) {
      return
    }

    const authToken = getAuthToken()

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      auth: {
        token: authToken
      },
      query: {
        token: authToken
      }
    })

    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      set({ isConnected: true })

      newSocket.emit('join', { username: userId })
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server')
      set({ isConnected: false })
    })

    newSocket.on('new_message', (message: ChatMessage) => {
      console.log('New message received:', message)
      get().addMessage(message)
    })

    newSocket.on('message_sent', (data: { messageId: string, timestamp: string, delivered: boolean }) => {
      console.log('Message sent confirmation:', data)
      // Find and update the most recent temporary message
      get().confirmLatestTemporaryMessage(data.messageId, data.timestamp, data.delivered)
    })

    newSocket.on('user_status_changed', ({ userId, isOnline }: { userId: string, isOnline: boolean }) => {
      if (isOnline) {
        get().addOnlineUser(userId)
      } else {
        get().removeOnlineUser(userId)
      }
    })

    newSocket.on('joined', ({ userId }: { userId: string }) => {
      console.log('Successfully joined with userId:', userId)
    })

    newSocket.on('message_sent', ({ messageId, timestamp, delivered }: any) => {
      console.log('Message sent confirmation:', { messageId, timestamp, delivered })
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    set({ socket: newSocket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  sendMessage: (recipientUsername: string, content: string, replyTo?: string) => {
    const { socket } = get()
    const currentEntity = getCurrentEntity()
    const type = getUserType() === 'institution' ? 'institute' : 'user';

    if (!socket?.connected) {
      console.error('Socket not connected')
      return
    }

    if (!currentEntity?.id) {
      console.error('No current entity available')
      return
    }

    const tempId = `temp_${Date.now()}`
    const tempMessage = {
      id: tempId,
      content,
      senderUsername: currentEntity.id,
      recipientUsername,
      timestamp: new Date().toISOString(),
      replyTo,
      tempId,
      sending: true
    }

    const conversationKey = [currentEntity.id, recipientUsername].sort().join('_')
    const currentMessages = get().messages[conversationKey] || []
    get().setMessages(conversationKey, [...currentMessages, tempMessage])

    socket.emit('send_message', {
      recipientUsername,
      content,
      replyTo,
      type,
    })
  },

  fetchMessages: async (currentUserId: string, otherUsername: string, limit = 50, offset = 0) => {
    try {
      const messages = await fetchMessagesService(currentUserId, otherUsername, limit, offset)
      const conversationKey = [currentUserId, otherUsername].sort().join('_')
      get().setMessages(conversationKey, messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  },

  fetchConversations: async (currentUserId: string) => {
    try {
      const conversations = await fetchConversationsService(currentUserId)
      get().setConversations(conversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }
}))
