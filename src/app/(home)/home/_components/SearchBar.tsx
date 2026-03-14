"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Search, User, MapPin, Building2 } from "lucide-react"
import { searchUsers } from '@/lib/api/services/user'
import { searchInstitutions } from '@/lib/api/services/institute'
import { User as UserType, Institution } from '@/lib/api/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
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

  const handleUserClick = (user: UserType) => {    
    const isInstitution = user.role?.toLowerCase().includes('institution') || 
                         user.role?.toLowerCase().includes('hospital') ||
                         user.role?.toLowerCase().includes('university') ||
                         user.role?.toLowerCase().includes('college') ||
                         user.role?.toLowerCase().includes('company')
    
    if (isInstitution) {
      router.push(`/institute-details/${user.id}`)
    } else {
      router.push(`/profile/${user.id}`)
    }
    
    setSearchOpen(false)
  }

  const handleInstitutionClick = (institution: Institution) => {
    router.push(`/institute-details/${institution.id}`)
    setSearchOpen(false)
  }

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 z-10 mb-0">
      <div ref={searchRef} className="relative">
        <form onSubmit={handleSearchSubmit} className="relative bg-gray-100 rounded-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search Pharma Connect..."
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
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                            onClick={() => handleUserClick(user)}
                          >
                            <div className="flex-shrink-0">
                              <Image
                                src={user.profile_picture || '/pp.png'}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-10 h-10"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {user.role}
                              </div>
                              {user.location && (
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {user.location}
                                </div>
                              )}
                            </div>
                            {user.verified && (
                              <div className="flex-shrink-0">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
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
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                            onClick={() => handleInstitutionClick(institution)}
                          >
                            <div className="flex-shrink-0">
                              <Image
                                src={institution.profile_picture || '/pp.png'}
                                alt={institution.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-10 h-10"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {institution.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {institution.type}
                              </div>
                              {institution.location && (
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {institution.location}
                                </div>
                              )}
                            </div>
                            {institution.verified && (
                              <div className="flex-shrink-0">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <User className="h-8 w-8 text-gray-300" />
                      <div>No results found for "{searchValue}"</div>
                      <div className="text-sm text-gray-400">Try a different search term</div>
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
              Start typing to search for people and institutions...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
