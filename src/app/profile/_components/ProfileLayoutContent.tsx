"use client";

import React, { useEffect } from 'react'
import LeftSidebar from '../../../components/LeftSidebar'
import { RightSidebar } from '../../(home)/home/_components/RightSidebar'
import { useUserStore, useInstitutionStore } from '@/store'
import { getUserType, getAuthToken } from '@/lib/api/utils'

interface ProfileLayoutContentProps {
  children: React.ReactNode
}

export default function ProfileLayoutContent({ children }: ProfileLayoutContentProps) {
  const { currentUser, fetchCurrentUser } = useUserStore()
  const { currentInstitution, fetchCurrentInstitution } = useInstitutionStore()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [userTypeState, setUserTypeState] = React.useState<string | null>(null)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return
    
    setIsLoggedIn(true)
    const type = getUserType()
    setUserTypeState(type)

    if (type === 'institution') {
      fetchCurrentInstitution()
    } else {
      fetchCurrentUser()
    }
  }, [fetchCurrentUser, fetchCurrentInstitution])

  const currentEntity = (() => {
    if (userTypeState === 'institution' && currentInstitution) {
      return {
        id: currentInstitution.id,
        name: currentInstitution.name,
        location: currentInstitution.location,
        profile_picture: currentInstitution.profile_picture,
        type: currentInstitution.type,
        verified: currentInstitution.verified,
        employees_count: currentInstitution.employees_count,
        area_of_expertise: currentInstitution.area_of_expertise,
      };
    }

    return currentUser;
  })();

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-8xl mx-auto flex justify-center">
        {isLoggedIn && (
          <div className="sticky top-0 h-screen flex-shrink-0">
            <div className="w-16 xl:w-64 transition-all duration-200 h-full">
              <LeftSidebar user={currentEntity} />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 w-full border-x border-gray-200 bg-gray-50/30">
          <main className="w-full p-2 sm:p-4 md:p-6">
            {children}
          </main>
        </div>

        {isLoggedIn && userTypeState !== 'INSTITUTE' && (
          <div className="hidden lg:block w-80 sticky top-0 h-screen flex-shrink-0">
            <div className="h-full overflow-y-auto bg-white">
              <RightSidebar />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
