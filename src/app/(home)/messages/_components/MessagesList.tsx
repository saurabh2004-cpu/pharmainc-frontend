"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreHorizontal, MessageCircle, Plus, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store'
import { useUserStore } from '@/store'
import { useInstitutionStore } from '@/store/institutionStore'
import UserSearchBar from './UserSearchBar'
import ConnectionStatus from './ConnectionStatus'
import { getProfilePictureUrl, isProfilePictureUrl } from '@/lib/utils'
import { useCurrentEntity } from '@/lib/utils/entityUtils'

interface Message {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatar?: string
    verified?: boolean
    online?: boolean
  }
  lastMessage: string
  timestamp: string
  unread: boolean
}

export default function MessagesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [showNewChatPanel, setShowNewChatPanel] = useState(false)
  const { 
    setSelectedChat, 
    conversations, 
    selectedChat,
    onlineUsers,
    fetchConversations 
  } = useChatStore()
  const { fetchUserById } = useUserStore()
  const { fetchInstitutionById } = useInstitutionStore()
  const { currentEntity } = useCurrentEntity()
  const router = useRouter()

  // Handle ESC key to close new chat panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showNewChatPanel) {
        setShowNewChatPanel(false)
      }
    }

    if (showNewChatPanel) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showNewChatPanel])

  // Fetch conversations on mount and periodically
  useEffect(() => {
    if (currentEntity?.id) {
      fetchConversations(currentEntity.id)
      
      // Refresh conversations every 30 seconds
      const interval = setInterval(() => {
        if (currentEntity?.id) {
          fetchConversations(currentEntity.id)
        }
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [currentEntity?.id, fetchConversations])

  // Debug log when conversations change
  useEffect(() => {
    console.log('Conversations updated:', conversations)
  }, [conversations])

  // Convert conversations to messages format for display
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  
  useEffect(() => {
    const convertConversationsToMessages = async () => {
      if (!conversations.length || !currentEntity?.id) {
        setMessages([])
        return
      }
      
      setLoadingConversations(true)
      
      try {
        const messagePromises = conversations.map(async (conv) => {
          // Find the other participant (not the current entity)
          const otherUserId = conv.participants.find(p => p !== currentEntity.id)
          if (!otherUserId) return null
          
          // Format timestamp for display
          const messageDate = new Date(conv.lastMessageAt)
          const now = new Date()
          
          let timestamp: string
          if (messageDate.toDateString() === now.toDateString()) {
            // Today - show time
            timestamp = messageDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })
          } else {
            // Other days - show date
            const diffTime = now.getTime() - messageDate.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            
            if (diffDays < 7) {
              timestamp = messageDate.toLocaleDateString('en-US', { weekday: 'short' })
            } else {
              timestamp = messageDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            }
          }
          
          // Try fetching as user first, then as institution
          try {
            const otherUser = await fetchUserById(otherUserId)
            console.log('Fetched user for conversation:', otherUser)
            
            if (otherUser.name === 'Unknown User' && otherUser.role === 'Unknown Role') {
              console.log('Got fallback user, trying institution instead:', otherUserId)
              
              try {
                const institution = await fetchInstitutionById(otherUserId)
                console.log('Fetched institution for conversation:', institution)
                
                if (institution.name === 'Unknown Institution') {
                  // Both failed, return Unknown User
                  return {
                    id: conv._id,
                    user: {
                      id: otherUserId,
                      name: 'Unknown User',
                      username: otherUserId,
                      avatar: undefined,
                      verified: false,
                      online: onlineUsers.has(otherUserId)
                    },
                    lastMessage: conv.lastMessage,
                    timestamp,
                    unread: conv.lastSender !== currentEntity?.id
                  }
                }
                
                // Successfully fetched institution
                return {
                  id: conv._id,
                  user: {
                    id: institution.id || otherUserId,
                    name: institution.name || 'Unknown Institution',
                    username: institution.id || otherUserId,
                    avatar: institution.profile_picture,
                    verified: institution.verified || false,
                    online: onlineUsers.has(otherUserId)
                  },
                  lastMessage: conv.lastMessage,
                  timestamp,
                  unread: conv.lastSender !== currentEntity?.id
                }
              } catch (institutionError) {
                console.error('Error fetching institution for:', otherUserId, institutionError)
                
                // Return fallback with "Unknown User"
                return {
                  id: conv._id,
                  user: {
                    id: otherUserId,
                    name: 'Unknown User',
                    username: otherUserId,
                    avatar: undefined,
                    verified: false,
                    online: onlineUsers.has(otherUserId)
                  },
                  lastMessage: conv.lastMessage,
                  timestamp,
                  unread: conv.lastSender !== currentEntity?.id
                }
              }
            }
            
            // Successfully fetched user (not a fallback)
            return {
              id: conv._id,
              user: {
                id: otherUser.id || otherUserId,
                name: otherUser.name || 'Unknown User',
                username: otherUser.id || otherUserId,
                avatar: otherUser.profilePicture,
                verified: false, // User type from store doesn't have verified field
                online: onlineUsers.has(otherUserId)
              },
              lastMessage: conv.lastMessage,
              timestamp,
              unread: conv.lastSender !== currentEntity?.id
            }
          } catch (userError) {
            console.error('Unexpected error fetching user:', otherUserId, userError)
            
            // This shouldn't happen since fetchUserById returns a fallback
            // But handle it just in case
            return {
              id: conv._id,
              user: {
                id: otherUserId,
                name: 'Unknown User',
                username: otherUserId,
                avatar: undefined,
                verified: false,
                online: onlineUsers.has(otherUserId)
              },
              lastMessage: conv.lastMessage,
              timestamp,
              unread: conv.lastSender !== currentEntity?.id
            }
          }
        })
        
        const resolvedMessages = await Promise.all(messagePromises)
        const validMessages = resolvedMessages.filter(Boolean) as Message[]
        
        // Sort by last message time (most recent first)
        validMessages.sort((a, b) => {
          const aConv = conversations.find(c => c._id === a.id)
          const bConv = conversations.find(c => c._id === b.id)
          if (!aConv || !bConv) return 0
          return new Date(bConv.lastMessageAt).getTime() - new Date(aConv.lastMessageAt).getTime()
        })
        
        setMessages(validMessages)
      } catch (error) {
        console.error('Error converting conversations:', error)
        setMessages([])
      } finally {
        setLoadingConversations(false)
      }
    }
    
    convertConversationsToMessages()
  }, [conversations, currentEntity?.id, onlineUsers, fetchUserById])

  const filteredMessages = messages.filter(message =>
    message.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Helper function to get proper profile picture URL (same logic as ProfileHeader)
  const getUserProfilePicture = (user: { id: string, avatar?: string }) => {
    const profilePicture = user.avatar;
    
    if (!profilePicture) return "/pp.png";
    
    // If it's already a profile picture URL from our API, use it as is
    if (isProfilePictureUrl(profilePicture)) {
      return profilePicture;
    }
    
    // If it's a legacy URL or external URL, use it as is
    if (profilePicture.startsWith('http') || profilePicture.startsWith('/')) {
      return profilePicture;
    }
    
    // Otherwise, assume it's just a filename and construct the URL
    return getProfilePictureUrl(user.id, profilePicture);
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message.id)
    setSelectedChat({
      id: message.user.id,
      name: message.user.name,
      username: message.user.username,
      avatar: message.user.avatar,
      verified: message.user.verified,
      online: message.user.online
    })
  }

  // Update selected message when chat changes
  useEffect(() => {
    if (selectedChat) {
      const matchingMessage = messages.find(msg => msg.user.id === selectedChat.id)
      setSelectedMessage(matchingMessage?.id || null)
    }
  }, [selectedChat, messages])

  return (
    <div className="h-full flex flex-col bg-white w-96 relative">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold font-sans">Messages</h1>
          <div className="flex items-center gap-2">
            {/* <ConnectionStatus /> */}
            {/* New Chat Button */}
            {/* <button 
              onClick={() => setShowNewChatPanel(true)}
              className="p-2 hover:bg-blue-50 rounded-full transition-all duration-200 group hover:scale-110 active:scale-95"
              title="Start new conversation"
            >
              <Plus className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
            </button> */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Local Message Search - Always visible for existing conversations */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-gray-200 transition-colors"
          />
        </div>
      </div>

      <AnimatePresence>
        {showNewChatPanel && (
          <div className="absolute inset-0 z-[5]">
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-20"
              onClick={() => setShowNewChatPanel(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <motion.div
              className="absolute top-0 right-0 w-full h-full bg-white shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                duration: 0.3
              }}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold font-sans text-gray-800">New Chat</h2>
                  <button 
                    onClick={() => setShowNewChatPanel(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close new chat panel"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <UserSearchBar onUserSelect={() => setShowNewChatPanel(false)} />
              </div>
              
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Search for people or institutions to start a new conversation</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto">
        {loadingConversations ? (
          <div className="flex flex-col items-center justify-center h-32 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <div className="text-sm text-gray-500">Loading conversations...</div>
          </div>
        ) : filteredMessages.length > 0 ? filteredMessages.map((message) => (
          <div
            key={message.id}
            onClick={() => handleMessageClick(message)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedMessage === message.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={getUserProfilePicture(message.user)} alt={message.user.name} />
                  <AvatarFallback>
                    {message.user.name.split(' ').map((n, i) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {message.user.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold text-sm truncate ${message.unread ? 'text-black' : 'text-gray-900'}`}>
                      {message.user.name}
                    </span>
                    {message.user.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${message.unread ? 'font-medium text-black' : 'text-gray-600'}`}>
                    {message.lastMessage}
                  </p>
                  {message.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center h-full py-16 px-4">
            <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">
              {searchTerm ? 'No matching conversations' : 'No messages yet'}
            </h3>
            {!searchTerm && (
              <p className="text-gray-400 text-center">
                Use the search above to find people to message
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
