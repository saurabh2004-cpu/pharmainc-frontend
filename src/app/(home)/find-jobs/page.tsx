"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { Search, Filter, MapPin, Building, DollarSign, ArrowLeft, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobList from '../jobs/_components/JobList';
import JobRightSidebar from './_components/JobRightSidebar';
import { useJobStore, useUserStore } from '@/store';
import { searchJobs, listJobs } from '@/lib/api/services/job';
import { Job, Institution } from '@/lib/api/types';

interface JobWithInstitution extends Job {
  institution?: Institution;
}

const FindJobsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const filtersRef = useRef<HTMLDivElement>(null);


  const { currentUser, fetchUserApplications, fetchSavedJobs } = useUserStore();

  const {
    jobs,
    loading,
    loadingMore,
    hasMore,
    totalJobs,
    fetchJobs,
    loadMoreJobs,
    clearJobs,
    setFilters: setJobStoreFilters
  } = useJobStore();

  const [filters, setFilters] = useState({
    location: 'all',
    jobType: 'all',
    experienceLevel: 'all',
    status: 'active',
    page: 1,
    pageSize: 20
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMoreJobs();
    }
  }, [inView, hasMore, loadingMore, loadMoreJobs]);

  const sortedJobs = useMemo(() => {
    const sorted = [...jobs];

    if (sortBy === 'default') {
      return sorted;
    }

    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'location':
          return (a.workLocation || a.location || '').localeCompare(b.workLocation || b.location || '');
        case 'created_at':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [jobs, sortBy]);

  const performSearch = async (searchFilters?: any, query?: string) => {
    clearJobs();

    const activeFilters = searchFilters || filters;
    const currentQuery = query !== undefined ? query : searchQuery;

    const apiFilters = {
      searchQuery: currentQuery,
      jobType: activeFilters.jobType === 'all' ? undefined : activeFilters.jobType,
      location: activeFilters.location === 'all' ? undefined : activeFilters.location,
      experienceLevel: activeFilters.experienceLevel === 'all' ? undefined : activeFilters.experienceLevel,
      status: activeFilters.status === 'all' ? 'active' : activeFilters.status,
    };

    setJobStoreFilters(apiFilters);
    fetchJobs(1, 20, false, apiFilters);
  };

  useEffect(() => {
    performSearch();

    // Fetch user applications if user is logged in
    if (currentUser?.id) {
      fetchUserApplications(currentUser.id);
      fetchSavedJobs(currentUser.id);
    }

  }, [currentUser]);



  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node) && showFilters) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(filters, searchQuery);
    } else {
      performSearch(filters);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    performSearch(newFilters, searchQuery);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: 'all',
      jobType: 'all',
      experienceLevel: 'all',
      status: 'active',
      page: 1,
      pageSize: 20
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    performSearch(clearedFilters, '');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:gap-6">
        <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[calc(100%-22rem)]">
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs by title, company, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 text-sm sm:text-base border-gray-200 rounded-lg w-full bg-gray-50 focus:bg-white focus:border-blue-500 transition-all duration-200"
                  />
                  <button
                    className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${showFilters || filters.jobType !== 'all' || filters.experienceLevel !== 'all' || filters.location !== 'all'
                      ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div ref={filtersRef} className="border-t border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="jobType"
                            value="all"
                            checked={filters.jobType === 'all'}
                            onChange={(e) => handleFilterChange('jobType', e.target.value)}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">All Types</span>
                        </label>
                        {['Full-time', 'Part-time', 'Contract', 'Temporary'].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="radio"
                              name="jobType"
                              value={type}
                              checked={filters.jobType === type}
                              onChange={(e) => handleFilterChange('jobType', e.target.value)}
                              className="mr-2 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="experienceLevel"
                            value="all"
                            checked={filters.experienceLevel === 'all'}
                            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">All Levels</span>
                        </label>
                        {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map((level) => (
                          <label key={level} className="flex items-center">
                            <input
                              type="radio"
                              name="experienceLevel"
                              value={level}
                              checked={filters.experienceLevel === level}
                              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                              className="mr-2 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter location (e.g., New York, Remote)"
                          value={filters.location === 'all' ? '' : filters.location}
                          onChange={(e) => handleFilterChange('location', e.target.value || 'all')}
                          className="pl-10 pr-4 h-10 text-sm border-gray-200 rounded-lg w-full bg-gray-50 focus:bg-white focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {['Remote', 'On-site', 'Hybrid'].map((location) => (
                          <button
                            key={location}
                            onClick={() => handleFilterChange('location', location)}
                            className={`px-2 py-1 text-xs rounded-full border transition-colors ${filters.location === location
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                              }`}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {totalJobs} jobs found
                    </div>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="px-4 py-2"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {searchQuery ? `"${searchQuery}" Results` : 'All Jobs'}
                  </h1>
                  <span className="text-xs text-gray-500">
                    {loading ? 'Loading...' : `${totalJobs} results`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(searchQuery || filters.jobType !== 'all' || filters.experienceLevel !== 'all' || filters.location !== 'all') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-3 text-sm rounded-full"
                  >
                    Clear all
                  </Button>
                )}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="w-28 sm:w-32 h-8 text-xs sm:text-sm border border-gray-200 bg-white rounded-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="created_at">Recent</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <JobList
              jobs={sortedJobs}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              onLoadMore={loadMoreJobs}
            />

            {!loading && sortedJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  No jobs found
                </div>
                <div className="text-gray-400 text-sm">
                  Try different search terms or filters
                </div>
              </div>
            )}

            {hasMore && (
              <div ref={ref} className="flex justify-center py-4">
                {loadingMore && (
                  <div className="text-base sm:text-lg text-gray-600">Loading more jobs...</div>
                )}
              </div>
            )}
          </div>
        </div>

        <JobRightSidebar
          searchQuery={searchQuery}
          totalJobs={totalJobs}
          filters={filters}
          onFilterChange={handleFilterChange}
          formatTimeAgo={formatTimeAgo}
          currentUserId={currentUser?.id}
        />
      </div>
    </div>
  );
};

export default FindJobsPage;
