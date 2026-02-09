import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Institution, InstituteStats } from '@/lib/api/types'
import { getInstitution, getInstitutionById, updateInstitution, getInstituteStats } from '@/lib/api/services/institute'

interface InstitutionState {
  currentInstitution: Institution | null
  institutionCache: Record<string, Institution>
  instituteStats: InstituteStats | null
  loading: boolean
  error: string | null

  fetchCurrentInstitution: () => Promise<void>
  fetchInstitutionById: (id: string) => Promise<Institution>
  fetchInstituteStats: () => Promise<InstituteStats | null>
  updateCurrentInstitution: (institutionData: any) => Promise<Institution>
  clearInstitution: () => void
  setInstitution: (institution: Institution) => void
}

export const useInstitutionStore = create<InstitutionState>()(
  devtools(
    persist(
      (set, get) => ({
        currentInstitution: null,
        institutionCache: {},
        instituteStats: null,
        loading: false,
        error: null,

        fetchCurrentInstitution: async () => {
          console.log("Fetching current institution...");
          set({ loading: true, error: null })
          try {
            const institutionData = await getInstitution()
            console.log("Fetched institution data:", institutionData);

            set({
              currentInstitution: institutionData,
              institutionCache: {
                ...get().institutionCache,
                [institutionData.id || '']: institutionData
              },
              loading: false
            })
            console.log("Store updated with institution:", get().currentInstitution);
          } catch (error) {
            console.error('Error fetching current institution:', error)
            set({
              currentInstitution: null,
              loading: false,
              error: 'Failed to load institution profile'
            })
          }
        },

        fetchInstitutionById: async (id: string): Promise<Institution> => {
          const { institutionCache } = get()

          // Return cached institution if available
          if (institutionCache[id]) {
            return institutionCache[id]
          }

          try {
            const institutionData = await getInstitutionById(id)

            // Cache the institution
            set({
              institutionCache: {
                ...institutionCache,
                [id]: institutionData
              }
            })

            return institutionData
          } catch (error) {
            console.error(`Error fetching institution ${id}:`, error)
            const fallbackInstitution: Institution = {
              id,
              name: "Unknown Institution",
              location: "Unknown Location",
              type: "Unknown Type",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            set({
              institutionCache: {
                ...institutionCache,
                [id]: fallbackInstitution
              }
            })

            return fallbackInstitution
          }
        },

        fetchInstituteStats: async (): Promise<InstituteStats | null> => {
          set({ loading: true, error: null })
          try {
            const stats = await getInstituteStats()
            console
            set({
              instituteStats: stats,
              loading: false
            })
            return stats
          } catch (error) {
            console.error('Error fetching institute stats:', error)
            set({
              instituteStats: null,
              loading: false,
              error: 'Failed to load institute statistics'
            })
            return null
          }
        },

        updateCurrentInstitution: async (institutionData: any): Promise<Institution> => {
          set({ loading: true, error: null })
          try {
            const currentInst = get().currentInstitution;
            console.log("current institute in store",currentInst)
            if (!currentInst?.id) throw new Error("No active institution found");

            const updatedInstitution = await updateInstitution(currentInst.id, institutionData)

            set({
              currentInstitution: updatedInstitution,
              institutionCache: {
                ...get().institutionCache,
                [updatedInstitution.id || '']: updatedInstitution
              },
              loading: false
            })

            return updatedInstitution
          } catch (error) {
            console.error('Error updating institution:', error)
            set({
              loading: false,
              error: 'Failed to update institution'
            })
            throw error
          }
        },

        clearInstitution: () => {
          set({
            currentInstitution: null,
            institutionCache: {},
            instituteStats: null,
            error: null
          })
        },

        setInstitution: (institution: Institution) => {
          set({
            currentInstitution: institution,
            institutionCache: {
              ...get().institutionCache,
              [institution.id || '']: institution
            }
          })
        },
      }),
      {
        name: 'institution-store',
        partialize: (state) => ({
          currentInstitution: state.currentInstitution,
          institutionCache: state.institutionCache,
          instituteStats: state.instituteStats
        }),
      }
    ),
    { name: 'institution-store' }
  )
)
