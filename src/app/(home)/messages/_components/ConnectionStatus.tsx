"use client";

import React from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'

export default function ConnectionStatus() {
  const { isConnected } = useChatStore()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
        <Wifi className="w-3 h-3" />
        Connected
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
      <WifiOff className="w-3 h-3" />
      Connecting...
    </div>
  )
}
