"use client";

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import LeftSidebar from './LeftSidebar'
import { RightSidebar } from '../app/(home)/home/_components/RightSidebar'
import { NotificationProvider } from './NotificationProvider'
import { useUserStore, useInstitutionStore, useChatStore } from '@/store'
import { getUserType } from '@/lib/api/utils'
import { useCurrentEntity } from '@/lib/utils/entityUtils'

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { fetchCurrentUser } = useUserStore()
  const { fetchCurrentInstitution } = useInstitutionStore()
  const { currentEntity } = useCurrentEntity() // Use the safe hook
  const pathname = usePathname()

  const isMessagesPage = pathname?.startsWith('/messages')
  const isJobPage = pathname?.startsWith('/find-jobs')
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isSavedJobPage = pathname?.startsWith('/saved-jobs');
  // const isProfilePage = pathname?.startsWith('/profile');
  const userType = getUserType();

  useEffect(() => {
    // We can keep this effect or rely on entityUtils? 
    // entityUtils hook doesn't fetch, it just computes. 
    // So we invoke fetches here.
    // But wait, getEntityFetchers() in entityUtils also exists.
    // Let's just keep the existing fetch logic but unsafe getUserType in effect is fine.

    // Actually, getUserType() is safe in useEffect.
    const userType = getUserType()

    if (userType === 'institution') {
      fetchCurrentInstitution()
    } else {
      fetchCurrentUser()
    }
  }, [fetchCurrentUser, fetchCurrentInstitution])

  // Removed custom currentEntity computation using getUserType during render

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-white font-sans">
        <div className="max-w-8xl w-full mx-auto flex justify-center">
          <div className="sticky top-0 h-screen flex-shrink-0">
            <div className="w-16 xl:w-64 transition-all duration-200 h-full">
              <LeftSidebar user={currentEntity} />
            </div>
          </div>

          <div className="flex-1 min-w-0 border-x border-gray-200 pt-3">
            <main className="w-full h-full">
              {children}
            </main>
          </div>

          {
            (!isMessagesPage && !isJobPage && !isDashboardPage && !isSavedJobPage && userType !== 'INSTITUTE' && userType === 'USER') && (
              <div className="hidden lg:block w-80 sticky top-0 h-screen flex-shrink-0">
                <div className="h-full overflow-y-auto bg-white">
                  <RightSidebar />
                </div>
              </div>
            )
          }


        </div>
      </div>
    </NotificationProvider>
  )
}
