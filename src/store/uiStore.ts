import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isFirstTimeUser: boolean
  showWelcomeModal: boolean
  setFirstTimeUser: (isFirstTime: boolean) => void
  setShowWelcomeModal: (show: boolean) => void
  markUserAsReturning: () => void
  checkFirstTimeUser: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isFirstTimeUser: true,
      showWelcomeModal: false,

      setFirstTimeUser: (isFirstTime: boolean) => {
        set({ isFirstTimeUser: isFirstTime })
      },

      setShowWelcomeModal: (show: boolean) => {
        set({ showWelcomeModal: show })
      },

      markUserAsReturning: () => {
        set({ 
          isFirstTimeUser: false,
          showWelcomeModal: false 
        })
      },

      checkFirstTimeUser: () => {
        const { isFirstTimeUser } = get()
        if (isFirstTimeUser) {
          set({ showWelcomeModal: true })
        }
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ 
        isFirstTimeUser: state.isFirstTimeUser 
      }),
    }
  )
)
