import React from 'react'
import { Clock } from 'lucide-react'

export const ComingSoonTab = () => {
  return (
    <div className="text-center py-12">
      <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
      <p className="text-gray-600">We're working on exciting new features for your dashboard!</p>
      <div className="mt-6 space-y-2">
        <p className="text-sm text-gray-500">• Advanced Analytics</p>
        <p className="text-sm text-gray-500">• Performance Insights</p>
        <p className="text-sm text-gray-500">• Automated Reports</p>
      </div>
    </div>
  )
}
