import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/app/(home)/home/_components/types'
import { Application } from '@/lib/api/types'
import { getUser, getUserById } from '@/lib/api/services/user'
import { getAllUserApplications, getSavedJobs, saveJob, unsaveJob } from '@/lib/api/services/job'

interface UserState {
  currentUser: User | null
  userCache: Record<string, User>
  loading: boolean
  error: string | null

  applications: Application[]
  appliedJobIds: Set<string>
  savedJobIds: Set<string>
  applicationsLoading: boolean
  savedJobsLoading: boolean

  fetchCurrentUser: () => Promise<void>
  fetchUserById: (id: string) => Promise<User>
  clearUser: () => void
  setUser: (user: User) => void

  fetchUserApplications: (userId: string) => Promise<void>
  hasAppliedToJob: (jobId: string) => boolean
  addApplication: (application: Application) => void
  clearApplications: () => void

  fetchSavedJobs: (userId: string) => Promise<void>
  toggleSavedJob: (jobId: string) => Promise<void>
  isJobSaved: (jobId: string) => boolean
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,
        userCache: {},
        loading: false,
        error: null,

        applications: [],
        appliedJobIds: new Set<string>(),
        savedJobIds: new Set<string>(),
        applicationsLoading: false,
        savedJobsLoading: false,

        fetchCurrentUser: async () => {
          // Check if logged in as institute - skip user profile fetch
          // Institute entities don't have user profiles at /user/my-profile
          if (typeof window !== 'undefined') {
            try {
              const entityStoreData = localStorage.getItem('entity-store')
              if (entityStoreData) {
                const parsed = JSON.parse(entityStoreData)
                const entityType = parsed?.state?.entityType

                if (entityType === 'INSTITUTE') {
                  console.log('Skipping user profile fetch for institute entity')
                  set({ loading: false })
                  return
                }
              }
            } catch (error) {
              console.error('Error checking entity type:', error)
            }
          }

          set({ loading: true, error: null })
          try {
            const userData = await getUser()
            const transformedUser: User = {
              id: userData.id,
              name: userData.name,
              role: userData.role,
              speciality: userData.specialization,
              profilePicture: userData.profile_picture,
              location: userData.location,
              verified: userData.verified,
              experience: userData.experience,
            }

            set({
              currentUser: transformedUser,
              userCache: {
                ...get().userCache,
                [userData.id || '']: transformedUser
              },
              loading: false
            })
          } catch (error: any) {
            console.error('Error fetching current user:', error)

            // If 401 error, clear all user data
            if (error.response?.status === 401) {
              get().clearUser()
              get().clearApplications()
            }

            // Suppress 404 errors (likely an institute user without entity check)
            if (error.response?.status === 404) {
              console.log('User profile not found (likely institute entity)')
              set({ loading: false })
              return
            }

            set({
              currentUser: null,
              loading: false,
              error: 'Failed to load user profile'
            })
          }
        },

        fetchUserById: async (id: string): Promise<User> => {
          const { userCache } = get()
          // Return cached user if available
          if (userCache[id]) {
            return userCache[id]
          }

          try {
            const userData = await getUserById(id)
            const transformedUser: User = {
              id: userData.id,
              name: userData.name,
              role: userData.role,
              speciality: userData.specialization,
              profilePicture: userData.profile_picture,
              location: userData.location,
              verified: userData.verified,
              experience: userData.experience,
            }

            set({
              userCache: {
                ...userCache,
                [id]: transformedUser
              }
            })

            return transformedUser
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error)
            const fallbackUser: User = {
              id,
              name: "Unknown User",
              role: "Unknown Role",
              profilePicture: "/pp.png",
            }

            // Cache the fallback user to avoid repeated failed requests
            set({
              userCache: {
                ...userCache,
                [id]: fallbackUser
              }
            })

            return fallbackUser
          }
        },

        clearUser: () => {
          set({
            currentUser: null,
            userCache: {},
            error: null
          })
        },

        setUser: (user: User) => {
          set({
            currentUser: user,
            userCache: {
              ...get().userCache,
              [user.id || '']: user
            }
          })
        },

        fetchUserApplications: async (userId: string) => {
          set({ applicationsLoading: true, error: null })
          try {
            const applications = await getAllUserApplications(userId)
            const jobIds = new Set(applications.map(app => app.jobId))

            set({
              applications,
              appliedJobIds: jobIds,
              applicationsLoading: false
            })
          } catch (error) {
            console.error('Error fetching user applications:', error)
            set({
              error: 'Failed to fetch applications',
              applicationsLoading: false
            })
          }
        },

        fetchSavedJobs: async (userId: string) => {
          set({ savedJobsLoading: true })
          try {
            const savedJobs = await getSavedJobs(userId)
            const ids = new Set(savedJobs.map((item: any) => item.jobId || item.id))
            set({ savedJobIds: ids, savedJobsLoading: false })
          } catch (error) {
            console.error('Error fetching saved jobs:', error)
            set({ savedJobsLoading: false })
          }
        },

        toggleSavedJob: async (jobId: string) => {
          const { savedJobIds } = get()
          const isSaved = savedJobIds.has(jobId)

          // Optimistic update
          const newSavedIds = new Set(savedJobIds)
          if (isSaved) {
            newSavedIds.delete(jobId)
          } else {
            newSavedIds.add(jobId)
          }
          set({ savedJobIds: newSavedIds })

          try {
            if (isSaved) {
              await unsaveJob(jobId)
            } else {
              await saveJob(jobId)
            }
          } catch (error) {
            console.error('Error toggling saved job:', error)
            // Revert on failure
            set({ savedJobIds: savedJobIds })
          }
        },

        isJobSaved: (jobId: string) => {
          return get().savedJobIds.has(jobId)
        },

        hasAppliedToJob: (jobId: string) => {
          return get().appliedJobIds.has(jobId)
        },

        addApplication: (application: Application) => {
          set(state => ({
            applications: [...state.applications, application],
            appliedJobIds: new Set([...state.appliedJobIds, application.jobId])
          }))
        },

        clearApplications: () => {
          set({
            applications: [],
            appliedJobIds: new Set<string>(),
            error: null
          })
        },
      }),
      {
        name: 'user-store',
        partialize: (state) => ({
          currentUser: state.currentUser,
          userCache: state.userCache,
          applications: state.applications,
          appliedJobIds: Array.from(state.appliedJobIds),
          savedJobIds: Array.from(state.savedJobIds)
        }),
        merge: (persistedState: any, currentState) => ({
          ...currentState,
          ...persistedState,
          appliedJobIds: new Set(persistedState?.appliedJobIds || []),
          savedJobIds: new Set(persistedState?.savedJobIds || [])
        }),
      }
    ),
    { name: 'user-store' }
  )
)
