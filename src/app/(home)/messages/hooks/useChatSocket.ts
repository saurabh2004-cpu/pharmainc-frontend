import { useEffect } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useUserStore } from '@/store/userStore'

export const useChatSocket = () => {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    fetchConversations,
    socket
  } = useChatStore()
  
  const { currentUser } = useUserStore()

  useEffect(() => {
    if (currentUser?.id && !isConnected) {
      connect(currentUser.id)
      
      // Fetch initial conversations
      if (currentUser.id) {
        fetchConversations(currentUser.id)
      }
    }

    return () => {
      if (socket?.connected) {
        disconnect()
      }
    }
  }, [currentUser?.id, connect, disconnect, isConnected, fetchConversations, socket])

  return {
    isConnected,
    currentUserId: currentUser?.id
  }
}
