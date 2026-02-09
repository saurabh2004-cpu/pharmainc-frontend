"use client";

import React from 'react'
import { MessageCircle, Search, Users } from 'lucide-react'

export default function EmptyChatState() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
          Your messages
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Send private messages to your connections. Search for people to start a conversation or select an existing chat.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-white p-4 rounded-lg border">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Search for people</div>
              <div>Use the search bar to find colleagues and professionals</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-white p-4 rounded-lg border">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Connect instantly</div>
              <div>Real-time messaging with online status indicators</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
