"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { searchUsers } from '@/lib/api/services/user'
import { searchInstitutions } from '@/lib/api/services/institute'
import { useChatStore } from '@/store'
import { getProfilePictureUrl, isProfilePictureUrl } from '@/lib/utils'

interface UserType {
  id: string
  name: string
  username?: string
  profile_picture?: string
  role?: string
  verified?: boolean
}

interface Institution {
  id: string
  name: string
  profile_picture?: string
  verified?: boolean
}

interface UserSearchBarProps {
  onUserSelect?: () => void
}

export default function UserSearchBar({ onUserSelect }: UserSearchBarProps = {}) {
  const router = useRouter()
  const { setSelectedChat } = useChatStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState<UserType[]>([])
  const [institutionResults, setInstitutionResults] = useState<Institution[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const debouncedSearch = useCallback(
    async (query: string) => {
      if (query.trim().length < 2) {
        setSearchResults([])
        setInstitutionResults([])
        setHasSearched(false)
        return
      }

      setIsSearching(true)
      try {
        const [userResponse, institutionResponse] = await Promise.all([
          searchUsers({
            q: query
          }),
          searchInstitutions({
            q: query
          })
        ])
        
        setSearchResults(userResponse.users || [])
        setInstitutionResults(institutionResponse.institutes || [])
        setHasSearched(true)
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
        setInstitutionResults([])
        setHasSearched(true)
      } finally {
        setIsSearching(false)
      }
    },
    []
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue) {
        debouncedSearch(searchValue)
      } else {
        setSearchResults([])
        setInstitutionResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, debouncedSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    if (!value.trim()) {
      setSearchResults([])
      setInstitutionResults([])
      setHasSearched(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      debouncedSearch(searchValue)
    }
  }

  const getUserProfilePicture = (user: UserType) => {
    const profilePicture = user.profile_picture;
    
    if (!profilePicture) return "/pp.png";
    
    if (isProfilePictureUrl(profilePicture)) {
      return profilePicture;
    }
    
    if (profilePicture.startsWith('http') || profilePicture.startsWith('/')) {
      return profilePicture;
    }
    
    return getProfilePictureUrl(user.id, profilePicture);
  }

  const getInstitutionProfilePicture = (institution: Institution) => {
    const profilePicture = institution.profile_picture;
    
    if (!profilePicture) return "/pp.png";
    
    if (isProfilePictureUrl(profilePicture)) {
      return profilePicture;
    }
    
    if (profilePicture.startsWith('http') || profilePicture.startsWith('/')) {
      return profilePicture;
    }
    
    return getProfilePictureUrl(institution.id, profilePicture);
  }

  const handleUserClick = (user: UserType) => {
    setSelectedChat({
      id: user.id,
      name: user.name,
      username: user.username || user.id,
      avatar: user.profile_picture,
      verified: user.verified || false,
      online: false
    })
    
    setSearchOpen(false)
    setSearchValue("")
    setSearchResults([])
    setInstitutionResults([])
    
    onUserSelect?.()
  }

  const handleInstitutionClick = (institution: Institution) => {
    setSelectedChat({
      id: institution.id,
      name: institution.name,
      username: institution.id,
      avatar: institution.profile_picture,
      verified: institution.verified || false,
      online: false
    })
    
    setSearchOpen(false)
    setSearchValue("")
    setSearchResults([])
    setInstitutionResults([])
    
    onUserSelect?.()
  }

  return (
    <div ref={searchRef} className="relative mb-4">
      <form onSubmit={handleSearchSubmit} className="relative bg-gray-100 rounded-full">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        <input
          type="text"
          placeholder="Search people to message..."
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setSearchOpen(true)}
          className="w-full bg-transparent border-0 rounded-full py-3 pl-12 pr-4 text-base placeholder:text-gray-500 focus:outline-none focus:ring-0"
        />
      </form>
      
      {searchOpen && searchValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-20">
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="py-6 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  Searching...
                </div>
              </div>
            ) : hasSearched ? (
              searchResults.length > 0 || institutionResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.length > 0 && (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        People ({searchResults.length})
                      </div>
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserClick(user)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={getUserProfilePicture(user)} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map((n, i) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-900">{user.name}</span>
                              {user.verified && (
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{user.role}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {institutionResults.length > 0 && (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Institutions ({institutionResults.length})
                      </div>
                      {institutionResults.map((institution) => (
                        <div
                          key={institution.id}
                          onClick={() => handleInstitutionClick(institution)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={getInstitutionProfilePicture(institution)} alt={institution.name} />
                            <AvatarFallback>
                              {institution.name.split(' ').map((n, i) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-900">{institution.name}</span>
                              {institution.verified && (
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">Institution</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <User className="h-8 w-8 text-gray-300" />
                    <span>No users found matching "{searchValue}"</span>
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}

      {searchOpen && !searchValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-20">
          <div className="py-6 text-center text-gray-500">
            Start typing to search for people and institutions to message...
          </div>
        </div>
      )}
    </div>
  )
}
