
export const getConversationKey = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_')
}

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

export const truncateMessage = (message: string, maxLength: number = 50): string => {
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
}

export const isUserOnline = (userId: string, onlineUsers: Set<string>): boolean => {
  return onlineUsers.has(userId)
}
