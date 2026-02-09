import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Connect, User } from '@/lib/api/types'
import { 
  getUserConnections, 
  connectUser, 
  disconnectUser, 
  acceptConnection,
  followUser,
  unfollowUser,
  getUserFollowed
} from '@/lib/api/services/network'

export type ConnectionStatus = 'connected' | 'pending_sent' | 'pending_received' | 'none'
export type FollowStatus = 'following' | 'not_following'

interface ConnectionsState {
  connections: Connect[]
  connectionStatusMap: Record<string, ConnectionStatus>
  followedUsers: User[]
  followingStatusMap: Record<string, FollowStatus>
  loading: boolean
  error: string | null

  // Connection Actions
  fetchConnections: (userId: string) => Promise<void>
  ensureConnectionsLoaded: (userId: string) => Promise<void>
  getConnectionStatus: (currentUserId: string, targetUserId: string) => ConnectionStatus
  connectToUser: (currentUserId: string, targetUserId: string, id2_poster_type: "user" | "institute") => Promise<void>
  disconnectFromUser: (currentUserId: string, targetUserId: string, id2_poster_type: "user" | "institute") => Promise<void>
  acceptConnectionRequest: (currentUserId: string, requesterId: string) => Promise<void>
  rejectConnectionRequest: (currentUserId: string, requesterId: string, id2_poster_type: "user" | "institute") => Promise<void>
  clearConnections: () => void

  // Following Actions
  fetchFollowedUsers: () => Promise<void>
  ensureFollowedUsersLoaded: () => Promise<void>
  getFollowStatus: (targetUserId: string) => FollowStatus
  followUserAction: (targetUserId: string, id2_poster_type: "user" | "institute") => Promise<void>
  unfollowUserAction: (targetUserId: string, id2_poster_type: "user" | "institute") => Promise<void>
  clearFollowing: () => void
}

export const useConnectionsStore = create<ConnectionsState>()(
  devtools(
    persist(
      (set, get) => ({
        connections: [],
        connectionStatusMap: {},
        followedUsers: [],
        followingStatusMap: {},
        loading: false,
        error: null,

        fetchConnections: async (userId: string) => {
          set({ loading: true, error: null })
          try {
            const connections = await getUserConnections(userId)
            const connectionStatusMap: Record<string, ConnectionStatus> = {}

            // Build status map for quick lookup
            connections.forEach(conn => {
              const otherUserId = conn.id1 === userId ? conn.id2 : conn.id1
              
              if (conn.accepted) {
                connectionStatusMap[otherUserId] = 'connected'
              } else {
                // If current user is user1, they sent the request
                // If current user is user2, they received the request
                connectionStatusMap[otherUserId] = conn.id1 === userId 
                  ? 'pending_sent' 
                  : 'pending_received'
              }
            })

            set({ 
              connections,
              connectionStatusMap,
              loading: false 
            })
          } catch (error) {
            console.error('Error fetching connections:', error)
            set({ 
              error: 'Failed to load connections',
              loading: false 
            })
          }
        },

        ensureConnectionsLoaded: async (userId: string) => {
          const { connections } = get()
          if (connections.length === 0) {
            await get().fetchConnections(userId)
          }
        },

        getConnectionStatus: (currentUserId: string, targetUserId: string): ConnectionStatus => {
          if (currentUserId === targetUserId) return 'none'
          const { connectionStatusMap } = get()
          
          return connectionStatusMap[targetUserId] || 'none'
        },

        connectToUser: async (currentUserId: string, targetUserId: string, id2_poster_type: "user" | "institute") => {
          try {
            const connection = await connectUser({ id2: targetUserId , id2_poster_type })
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = [...connections, connection]
            const newStatusMap = {
              ...connectionStatusMap,
              [targetUserId]: 'pending_sent' as ConnectionStatus
            }

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error connecting to user:', error)
            throw error
          }
        },

        disconnectFromUser: async (currentUserId: string, targetUserId: string, id2_poster_type: "user" | "institute") => {
          try {
            await disconnectUser({ id2: targetUserId , id2_poster_type})
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = connections.filter(conn => {
              const otherUserId = conn.id1 === currentUserId ? conn.id2 : conn.id1
              return otherUserId !== targetUserId
            })
            
            const newStatusMap = { ...connectionStatusMap }
            delete newStatusMap[targetUserId]

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error disconnecting from user:', error)
            throw error
          }
        },

        acceptConnectionRequest: async (currentUserId: string, requesterId: string) => {
          try {
            const updatedConnection = await acceptConnection(requesterId)
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = connections.map(conn => {
              if ((conn.id1 === requesterId && conn.id2 === currentUserId) ||
                  (conn.id1 === currentUserId && conn.id2 === requesterId)) {
                return { ...conn, accepted: true }
              }
              return conn
            })
            
            const newStatusMap = {
              ...connectionStatusMap,
              [requesterId]: 'connected' as ConnectionStatus
            }

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error accepting connection request:', error)
            throw error
          }
        },

        rejectConnectionRequest: async (currentUserId: string, requesterId: string , id2_poster_type: "user" | "institute") => {
          try {
            await disconnectUser({ id2: requesterId , id2_poster_type})
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = connections.filter(conn => {
              return !((conn.id1 === requesterId && conn.id2 === currentUserId) ||
                      (conn.id1 === currentUserId && conn.id2 === requesterId))
            })
            
            const newStatusMap = { ...connectionStatusMap }
            delete newStatusMap[requesterId]

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error rejecting connection request:', error)
            throw error
          }
        },

        clearConnections: () => {
          set({ 
            connections: [],
            connectionStatusMap: {},
            error: null 
          })
        },

        // Following Actions
        fetchFollowedUsers: async () => {
          set({ loading: true, error: null })
          try {
            const followedUsers = await getUserFollowed()
            const followingStatusMap: Record<string, FollowStatus> = {}

            followedUsers.forEach(user => {
              followingStatusMap[user.id] = 'following'
            })

            set({
              followedUsers,
              followingStatusMap,
              loading: false
            })
          } catch (error) {
            console.error('Error fetching followed users:', error)
            set({
              error: 'Failed to load followed users',
              loading: false
            })
          }
        },

        ensureFollowedUsersLoaded: async () => {
          const { followedUsers } = get()
          if (followedUsers.length === 0) {
            await get().fetchFollowedUsers()
          }
        },

        getFollowStatus: (targetUserId: string): FollowStatus => {
          const { followingStatusMap } = get()
          return followingStatusMap[targetUserId] || 'not_following'
        },

        followUserAction: async (targetUserId: string, id2_poster_type: "user" | "institute") => {
          try {
            await followUser({ id2: targetUserId, id2_poster_type })
            
            // Update local state
            const { followingStatusMap } = get()
            const newStatusMap = {
              ...followingStatusMap,
              [targetUserId]: 'following' as FollowStatus
            }

            set({
              followingStatusMap: newStatusMap
            })

            // Don't refetch followed users here to avoid unnecessary API calls
            // The UI will show the updated status immediately from the status map
          } catch (error) {
            console.error('Error following user:', error)
            throw error
          }
        },

        unfollowUserAction: async (targetUserId: string, id2_poster_type: "user" | "institute") => {
          try {
            await unfollowUser({ id2: targetUserId, id2_poster_type })
            
            // Update local state
            const { followedUsers, followingStatusMap } = get()
            const newFollowedUsers = followedUsers.filter(user => user.id !== targetUserId)
            const newStatusMap = { ...followingStatusMap }
            delete newStatusMap[targetUserId]

            set({
              followedUsers: newFollowedUsers,
              followingStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error unfollowing user:', error)
            throw error
          }
        },

        clearFollowing: () => {
          set({
            followedUsers: [],
            followingStatusMap: {},
            error: null
          })
        },
      }),
      {
        name: 'connections-store',
        partialize: (state) => ({ 
          connections: state.connections,
          connectionStatusMap: state.connectionStatusMap,
          followedUsers: state.followedUsers,
          followingStatusMap: state.followingStatusMap 
        }),
      }
    ),
    { name: 'connections-store' }
  )
)
