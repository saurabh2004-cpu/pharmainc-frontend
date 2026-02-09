"use client";

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ChatErrorProps {
  error?: string
  onRetry?: () => void
  type?: 'connection' | 'fetch' | 'general'
}

export default function ChatError({ 
  error = 'Something went wrong', 
  onRetry,
  type = 'general' 
}: ChatErrorProps) {
  const getErrorMessage = () => {
    switch (type) {
      case 'connection':
        return 'Unable to connect to chat service. Please check your internet connection.'
      case 'fetch':
        return 'Failed to load messages. Please try again.'
      default:
        return error
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Connection Error
      </h3>
      <p className="text-gray-600 mb-4 max-w-sm">
        {getErrorMessage()}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}
