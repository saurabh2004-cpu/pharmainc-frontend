import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, UserMinus } from "lucide-react"
import { User } from "@/lib/api"

interface FollowerItemProps {
  user: User
  onUnfollow?: (userId: string) => void
  onMessage?: (userId: string) => void
  isLoading?: boolean
}

export const FollowerItem = ({ 
  user, 
  onUnfollow,
  onMessage,
  isLoading = false
}: FollowerItemProps) => {
  const router = useRouter()

  const handleProfileClick = () => {
    router.push(`/profile/${user.id}`)
  }

  return (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <Avatar className="h-12 w-12 cursor-pointer" onClick={handleProfileClick}>
        <AvatarImage
          src={user.profile_picture || "/pp.png"}
          alt={user.name}
        />
        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
          {user.name?.[0] || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 
              className="font-semibold text-gray-900 hover:underline cursor-pointer"
              onClick={handleProfileClick}
            >
              {user.name}
            </h3>
          {user.role && (
            <p className="text-sm text-gray-600">{user.role}</p>
          )}
          {user.location && (
            <p className="text-xs text-gray-500">{user.location}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {onMessage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage(user.id)}
              className="h-8 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-3 font-medium"
            >
              <MessageSquare className="h-3 w-3 mr-2" />
              Message
            </Button>
          )}
          {onUnfollow && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnfollow(user.id)}
              disabled={isLoading}
              className="h-8 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-full px-3 font-medium"
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <UserMinus className="h-3 w-3 mr-2" />
              )}
              Unfollow
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}
