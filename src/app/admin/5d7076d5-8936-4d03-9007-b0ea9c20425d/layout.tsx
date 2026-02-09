import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Admin Panel - Institute Onboarding',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  other: {
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache',
  },
}

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Institute Onboarding Management</p>
        </div>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout