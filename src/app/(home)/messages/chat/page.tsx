"use client";

import React from 'react'
import ChatInterface from '../_components/ChatInterface'
import MessagesList from '../_components/MessagesList'

export default function ChatPage() {

  // Mock data will replace with actual API calls later 
  // TODO => Backend API pending
  const mockSelectedUser = {
    id: "1",
    name: "Dr. Sarah Johnson",
    username: "sarah_j",
    avatar: "/api/placeholder/40/40",
    verified: true,
    online: true
  }

  return (
    <div className="flex h-full">
      <div className="w-60 border-r border-gray-200 h-full flex-shrink-0 bg-white">
        <MessagesList />
      </div>

      <div className="flex-1 h-full bg-white">
        <ChatInterface 
          recipientName={mockSelectedUser.name}
          recipientAvatar={mockSelectedUser.avatar}
          recipientUsername={mockSelectedUser.username}
          recipientVerified={mockSelectedUser.verified}
          recipientOnline={mockSelectedUser.online}
        />
      </div>
    </div>
  )
}
