"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Users, UserCheck, Heart, ArrowLeft } from "lucide-react"
import { ConnectionItem } from './_components/ConnectionItem'
import { FollowerItem } from './_components/FollowerItem'
import { FollowingItem } from './_components/FollowingItem'
import { LoginPrompt } from './_components/LoginPrompt'
import { useConnectionsStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'
import { useCurrentEntity, getEntityFetchers } from '@/lib/utils/entityUtils'
import { 
  getUserFollowers, 
  getUserFollowing,
  getUserFollowed,
  getUserById, 
  unfollowUser,
  Connect, 
  Follow,
  User 
} from '@/lib/api'

interface ConnectionWithUser extends Connect {
  user: User;
}

interface FollowWithUser extends Follow {
  user: User;
}

const MyNetworksContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const activeTab = searchParams?.get("tab") ?? "connections"
  
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({})
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [connectionsWithUsers, setConnectionsWithUsers] = useState<ConnectionWithUser[]>([])
  const [followers, setFollowers] = useState<FollowWithUser[]>([])
  const [loading, setLoading] = useState({
    connections: false,
    followers: false,
    following: false
  })
  
  const { currentEntity, isLoading, userType } = useCurrentEntity()
  const { fetchEntity } = getEntityFetchers()
  const { 
    connections, 
    fetchConnections: fetchConnectionsFromStore, 
    disconnectFromUser,
    loading: connectionsLoading,
    fetchFollowedUsers,
    followingStatusMap,
    followedUsers,
    unfollowUserAction
  } = useConnectionsStore()

  const handleTabChange = (tab: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    router.push(url.pathname + url.search)
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      console.log('Auth token:', token ? 'exists' : 'not found')
      
      if (token) {
        setIsAuthenticated(true)
        if (!currentEntity && !isLoading) {
          await fetchEntity()
        } else {
          console.log('Current entity:', currentEntity ? { id: currentEntity.id, name: currentEntity.name } : 'null')
        }
      } else {
        console.log('No auth token, entity not authenticated')
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [currentEntity, fetchEntity, isLoading])

  useEffect(() => {
    if (currentEntity?.id && isAuthenticated) {
      fetchConnectionsData()
      fetchFollowers()
      fetchFollowing()
    }
  }, [currentEntity?.id, isAuthenticated])

  const fetchConnectionsData = async () => {
    if (!currentEntity?.id) return
    
    setLoading(prev => ({ ...prev, connections: true }))
    try {
      // Fetch connections from store
      await fetchConnectionsFromStore(currentEntity.id)
      
      // Get accepted connections with user data
      const acceptedConnections = connections.filter(conn => conn.accepted)
      
      const connectionsWithUsersData = await Promise.all(
        acceptedConnections.map(async (conn) => {
          try {
            // Get the other user in the connection
            const otherUserId = conn.id1 === currentEntity.id ? conn.id2 : conn.id1
            const user = await getUserById(otherUserId)
            return { ...conn, user }
          } catch (error) {
            console.error(`Error fetching user:`, error)
            return null
          }
        })
      )
      
      const validConnections = connectionsWithUsersData.filter(Boolean) as ConnectionWithUser[]
      setConnectionsWithUsers(validConnections)
    } catch (error) {
      console.error('Error fetching connections:', error)
    } finally {
      setLoading(prev => ({ ...prev, connections: false }))
    }
  }

  useEffect(() => {
    if (currentEntity?.id && connections.length > 0) {
      const updateConnectionsWithUsers = async () => {
        const acceptedConnections = connections.filter(conn => conn.accepted)
        
        const connectionsWithUsersData = await Promise.all(
          acceptedConnections.map(async (conn) => {
            try {
              const otherUserId = conn.id1 === currentEntity.id ? conn.id2 : conn.id1
              const user = await getUserById(otherUserId)
              return { ...conn, user }
            } catch (error) {
              console.error(`Error fetching user:`, error)
              return null
            }
          })
        )
        
        const validConnections = connectionsWithUsersData.filter(Boolean) as ConnectionWithUser[]
        setConnectionsWithUsers(validConnections)
      }
      
      updateConnectionsWithUsers()
    }
  }, [connections, currentEntity?.id])

  const fetchFollowers = async () => {
    if (!currentEntity?.id) return
    
    setLoading(prev => ({ ...prev, followers: true }))
    try {
      const followers = await getUserFollowers(currentEntity.id)
      
      const followersWithUsers = await Promise.all(
        followers.map(async (follow) => {
          try {
            const user = await getUserById(follow.id1)
            return { ...follow, user }
          } catch (error) {
            console.error(`Error fetching user:`, error)
            return null
          }
        })
      )
      
      const validFollowers = followersWithUsers.filter(Boolean) as FollowWithUser[]
      setFollowers(validFollowers)
    } catch (error) {
      console.error('Error fetching followers:', error)
    } finally {
      setLoading(prev => ({ ...prev, followers: false }))
    }
  }

  const fetchFollowing = async () => {
    if (!currentEntity?.id) return
    
    setLoading(prev => ({ ...prev, following: true }))
    try {
      await fetchFollowedUsers()
      // Use the followed users from the store
      // The component will update automatically via store subscription
    } catch (error) {
      console.error('Error fetching following:', error)
    } finally {
      setLoading(prev => ({ ...prev, following: false }))
    }
  }

  const handleDisconnect = async (userId: string) => {
    if (!currentEntity?.id) return
    
    setLoadingStates(prev => ({ ...prev, [userId]: true }))
    
    try {
      // In the my-networks context, we're dealing with user connections
      await disconnectFromUser(currentEntity.id, userId, "user")
      setConnectionsWithUsers(prev => prev.filter(conn => conn.user.id !== userId))
    } catch (error) {
      console.error('Error disconnecting user:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleUnfollow = async (userId: string) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }))
    
    try {
      await unfollowUserAction(userId, "user")
    } catch (error) {
      console.error('Error unfollowing user:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleMessage = async (userId: string) => {
    router.push(`/messages?user=${userId}`)
  }

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">My Networks</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">My Networks</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="p-4 border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 border border-gray-200 rounded-full p-1">
            <TabsTrigger 
              value="connections" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <UserCheck className="w-4 h-4" />
              <span>Connections</span>
              {connectionsWithUsers.length > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {connectionsWithUsers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="followers" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              <span>Followers</span>
              {followers.length > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {followers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="following" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4" />
              <span>Following</span>
              {followedUsers.length > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {followedUsers.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent value="connections" className="">
            <div className="bg-white">
              {loading.connections ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div className="text-sm text-gray-600">Loading connections...</div>
                  </div>
                </div>
              ) : connectionsWithUsers.length > 0 ? (
                <div className="space-y-4 p-4">
                  {connectionsWithUsers.map((connection) => (
                    <ConnectionItem 
                      key={connection.id}
                      user={connection.user}
                      onDisconnect={handleDisconnect}
                      onMessage={handleMessage}
                      isLoading={loadingStates[connection.user.id] || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <UserCheck className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No connections yet</h3>
                  <p className="text-gray-400 text-center max-w-sm">Start connecting with other professionals to build your network</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="followers" className="">
            <div className="bg-white">
              {loading.followers ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div className="text-sm text-gray-600">Loading followers...</div>
                  </div>
                </div>
              ) : followers.length > 0 ? (
                <div className="space-y-4 p-4">
                  {followers.map((follower) => (
                    <FollowerItem 
                      key={follower.id}
                      user={follower.user}
                      onMessage={handleMessage}
                      isLoading={loadingStates[follower.user.id] || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <Users className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No followers yet</h3>
                  <p className="text-gray-400 text-center max-w-sm">Share interesting content to attract followers</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="following" className="">
            <div className="bg-white">
              {loading.following ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div className="text-sm text-gray-600">Loading following...</div>
                  </div>
                </div>
              ) : followedUsers.length > 0 ? (
                <div className="space-y-4 p-4">
                  {followedUsers.map((user) => (
                    <FollowingItem 
                      key={user.id}
                      user={user}
                      onUnfollow={handleUnfollow}
                      onMessage={handleMessage}
                      isLoading={loadingStates[user.id] || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <Heart className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">Not following anyone yet</h3>
                  <p className="text-gray-400 text-center max-w-sm">Discover and follow interesting professionals</p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

const MyNetworksPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyNetworksContent />
    </Suspense>
  )
}

export default MyNetworksPage;