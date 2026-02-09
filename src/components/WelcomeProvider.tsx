'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store'
import { WelcomeModal } from '@/components/WelcomeModal'

export function WelcomeProvider() {
  const { 
    isFirstTimeUser, 
    showWelcomeModal, 
    setShowWelcomeModal, 
    markUserAsReturning, 
    checkFirstTimeUser 
  } = useUIStore()

  useEffect(() => {
    checkFirstTimeUser()
  }, [checkFirstTimeUser])

  const handleCloseModal = () => {
    setShowWelcomeModal(false)
    markUserAsReturning()
  }

  // Remove the popup patch.
  return (
    <WelcomeModal
      // isOpen={showWelcomeModal}
      isOpen={false} 
      onClose={handleCloseModal}
    />
  )
}
