"use client";

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MessagesList from './_components/MessagesList'
import EmptyChatState from './_components/EmptyChatState'
import ChatInterface  from './_components/ChatInterface'
import { LoginPrompt } from './_components/LoginPrompt'
import { useChatStore } from '@/store'
import { useUserStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'
import { useCurrentEntity, getEntityFetchers } from '@/lib/utils/entityUtils'

function MessagesContent() {
  const searchParams = useSearchParams()
  const userIdFromUrl = searchParams.get('user')
  const messageFromUrl = searchParams.get('message')
  
  const { selectedChat, setSelectedChat, connect, disconnect, fetchConversations } = useChatStore()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [decodedMessage, setDecodedMessage] = useState<string>("")
  const { fetchUserById } = useUserStore()
  const { currentEntity, isLoading, userType } = useCurrentEntity()
  const { fetchEntity } = getEntityFetchers()

  useEffect(() => {
    if (messageFromUrl) {
      try {
        const decoded = decodeURIComponent(messageFromUrl)
        setDecodedMessage(decoded)
      } catch (error) {
        console.error('Failed to decode message parameter:', error)
        setDecodedMessage("")
      }
    } else {
      setDecodedMessage("")
    }
  }, [messageFromUrl])

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      
      if (token) {
        setIsAuthenticated(true)
        
        if (!currentEntity && !isLoading) {
          await fetchEntity()
        }
      } else {
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [currentEntity, fetchEntity, isLoading])

  // Initialize socket connection when entity is authenticated
  useEffect(() => {
    if (currentEntity?.id) {
      connect(currentEntity.id)
      fetchConversations(currentEntity.id)
      
      // Cleanup on unmount
      return () => {
        disconnect()
      }
    }
  }, [currentEntity?.id, connect, disconnect, fetchConversations])

  useEffect(() => {
    const selectUserFromUrl = async () => {
      if (userIdFromUrl && currentEntity?.id && isAuthenticated) {
        try {
          const userData = await fetchUserById(userIdFromUrl)
          if (userData && userData.id && userData.name) {
            setSelectedChat({
              id: userData.id,
              name: userData.name,
              username: userData.id,
              avatar: userData.profilePicture,
              verified: false,
              online: false
            })
          }
        } catch (error) {
          console.error('Error fetching user for direct message:', error)
        }
      }
    }

    selectUserFromUrl()
  }, [userIdFromUrl, currentEntity?.id, isAuthenticated, setSelectedChat, fetchUserById])

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div className="h-full bg-white flex" style={{ height: 'calc(100vh - 24px)' }}>
      <MessagesList />
      <div className="flex-1 h-full border-l border-gray-200">
        {
          selectedChat ? (
                <ChatInterface
                  recipientName={selectedChat.name}
                  recipientAvatar={selectedChat.avatar}
                  recipientUsername={selectedChat.username}
                  recipientVerified={selectedChat.verified}
                  recipientOnline={selectedChat.online}
                  initialMessage={decodedMessage}
                />
              ) : (
                <EmptyChatState />
              )
        }
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}