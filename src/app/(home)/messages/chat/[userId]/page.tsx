"use client";

import React from 'react'
import { useParams } from 'next/navigation'
import ChatInterface from '../../_components/ChatInterface'
import MessagesList from '../../_components/MessagesList'

// Mock user data - replace with actual API calls
const mockUsers = {
  "1": {
    name: "Dr. Sarah Johnson",
    username: "sarah_j",
    avatar: "/api/placeholder/40/40",
    verified: true,
    online: true
  },
  "2": {
    name: "PharmaTech Institute",
    username: "pharmatech",
    avatar: "/api/placeholder/40/40",
    verified: true,
    online: false
  },
  "3": {
    name: "Dr. Michael Chen",
    username: "mchen_md",
    avatar: "/api/placeholder/40/40",
    verified: false,
    online: true
  }
}

export default function ChatPage() {
  const params = useParams()
  const userId = params.userId as string
  
  const user = mockUsers[userId as keyof typeof mockUsers]
  
  if (!user) {
    return (
      <div className="flex h-full">
        <div className="w-80 border-r border-gray-200 h-full flex-shrink-0 bg-white">
          <MessagesList />
        </div>

        <div className="flex-1 h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              User not found
            </h2>
            <p className="text-gray-500">
              This conversation doesn't exist or has been deleted.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-gray-200 h-full flex-shrink-0 bg-white">
        <MessagesList />
      </div>

      <div className="flex-1 h-full bg-white">
        <ChatInterface 
          recipientName={user.name}
          recipientAvatar={user.avatar}
          recipientUsername={user.username}
          recipientVerified={user.verified}
          recipientOnline={user.online}
        />
      </div>
    </div>
  )
}
