"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSavedJobs, listJobs } from '@/lib/api/services/job';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';
import { Card, CardContent } from '@/components/ui/card';
import { Job, Institution } from '@/lib/api/types';
import JobRightSidebar from '../_components/JobRightSidebar';
import { generateSlug } from '@/lib/utils/slug';
import { buildImageUrl } from '@/utils/buildImageUrl';
import {
  ArrowLeft,
  Search,
  MapPin,
  Building2,
  Calendar,
  FileText,
  Trash2,
  ChevronUp,
  ChevronDown,
  DollarSign,
  Briefcase,
  X
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface SavedJobWithDetails extends Job {
  savedJobId?: string;
  savedAt?: string;
  institution?: Institution;
  companyName?: string;
  companyLogo?: string | null;
  jobId?: string;
}

const SavedJobsPage = () => {
  const router = useRouter();
  const { currentUser, toggleSavedJob, fetchSavedJobs: updateStoreSavedJobs, loading: userLoading } = useUserStore();

  const [savedJobs, setSavedJobs] = useState<SavedJobWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('savedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [itemsPerPage] = useState(10);

  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  // Auth check effect
  useEffect(() => {
    // If user loading is done and no user, we might want to redirect
    // BUT only if we are sure they are not authenticated. 
    // For now, let's just wait for user to load.
    // If eventually no user, we can show a "Login required" state or redirect.
    if (!userLoading && !currentUser) {
      // Optional: Redirect to auth? User complained about auto-redirects.
      // Safer to just show "Please login" or redirect only if we are VERY sure.
      const token = document.cookie.includes('accessToken'); // Simple check or use utils
      if (!token) {
        router.push('/auth');
      }
    }
  }, [currentUser, userLoading, router]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchSavedJobsList();
      fetchSuggestedJobs();
    } else if (!userLoading) {
      // If not loading and no user, stop loading spinner
      setLoading(false);
    }
  }, [currentUser, userLoading]);

  const fetchSavedJobsList = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getSavedJobs(currentUser.id);

      const transformedJobs: SavedJobWithDetails[] = response.map((item: any) => {
        const job = item.job || {};
        const institute = job.institute || {};

        return {
          ...job,
          savedJobId: item.id,
          savedAt: item.created_at,
          jobId: item.jobId || job.id,
          companyName: institute.name || 'Company Name',
          companyLogo: institute.profile_picture || null,
          institution: institute
        };
      });

      setSavedJobs(transformedJobs);
      updateStoreSavedJobs(currentUser.id);

    } catch (err: any) {
      console.error('Error fetching saved jobs:', err);
      setError(err.response?.data?.error || 'Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedJobs = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await listJobs(1, 10, undefined, undefined, undefined, 'active');
      const allJobs = response.data;
      const shuffledJobs = [...allJobs].sort(() => Math.random() - 0.5);
      setSuggestedJobs(shuffledJobs.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch suggested jobs:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleRemoveSavedJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!currentUser) return;

    try {
      // Optimistic update
      // We need to filter by the job ID. 
      // Note: 'job.id' in savedJobs might be the Job ID, but 'job.savedJobId' is the entry ID.
      // toggleSavedJob usually takes the Job ID.

      const jobToRemove = savedJobs.find(j => j.id === jobId || j.jobId === jobId);
      if (!jobToRemove) return;

      const targetId = jobToRemove.jobId || jobToRemove.id; // Correct Job ID

      setSavedJobs(current => current.filter(job => (job.jobId || job.id) !== targetId));

      await toggleSavedJob(targetId);
      toast.success('Job removed from saved list');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error('Failed to remove job');
      fetchSavedJobsList(); // Revert
    }
  };

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

  const filteredJobs = useMemo(() => {
    let filtered = [...savedJobs];

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [savedJobs, searchTerm]);

  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'salary':
          aValue = a.salaryMin || 0;
          bValue = b.salaryMin || 0;
          break;
        case 'savedAt':
        default:
          aValue = new Date(a.savedAt || 0).getTime();
          bValue = new Date(b.savedAt || 0).getTime();
          break;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [filteredJobs, sortField, sortDirection]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedJobs.slice(startIndex, endIndex);
  }, [sortedJobs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (userLoading || (loading && currentUser)) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-2 mx-auto flex flex-col lg:flex-row lg:gap-6 p-4 sm:p-6">
          <div className="w-full lg:flex-1">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not loading and not authenticated, we show nothing (effect handles redirect) 
  // or a login prompt if redirect didn't happen fast enough.
  if (!currentUser) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-600 mb-4">{error}</h2>
          <Button onClick={() => fetchSavedJobsList()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mb-12 lg:mb-0">
      <div className="px-0 sm:px-2 mx-auto flex flex-col lg:flex-row lg:gap-6">
        <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[calc(100%-22rem)]">
          <div className="p-4 sm:p-3 pb-20 lg:pb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="pl-0 hover:pl-2 transition-all h-8 sm:h-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 bg-white border border-gray-200 shadow-sm"
                >
                  <Briefcase className="h-5 w-5" />
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Jobs</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Jobs you have bookmarked for later</p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search saved jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                    <Select value={sortField} onValueChange={setSortField}>
                      <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savedAt">Date Saved</SelectItem>
                        <SelectItem value="title">Job Title</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="h-9 w-9 sm:h-10 sm:w-10 bg-[#233F64] text-white hover:bg-[#169BA4] hover:text-white"
                    >
                      {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {sortedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg border border-gray-200 border-dashed">
                <div className="">
                  <FileText className="h-10 w-10 text-[#169BA4]" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 font-sans">
                  {searchTerm ? 'No jobs found' : 'No saved jobs yet'}
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  {searchTerm
                    ? 'Try adjusting your search terms to find saved jobs.'
                    : 'Start saving jobs you\'re interested in to access them quickly later. Click the bookmark icon on any job card to save it.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push('/find-jobs')}
                    className="bg-[#233F64] hover:bg-[#169BA4]"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <Card
                    key={job.savedJobId || job.id}
                    className="hover:shadow-md transition-shadow cursor-pointer group rounded-xl sm:rounded-2xl"
                    onClick={() => router.push(`/find-jobs/${generateSlug(job as Job)}`)}
                  >
                    <CardContent className="p-2 sm:p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Institute logo: image if available, else colored initial */}
                        {job.companyLogo ? (
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src={buildImageUrl(job.companyLogo)}
                              alt={job.companyName || 'Institute'}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <UserAvatar name={job.companyName} className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-gray-100" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-0.5 sm:mb-1 group-hover:text-[#169BA4] transition-colors line-clamp-1">
                                {job.title}
                              </h3>
                              <p className="text-gray-500 text-sm sm:text-gray-600 mb-2 line-clamp-1">{job.companyName}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 -mt-1 -mr-2 h-8 w-8 sm:h-9 sm:w-9"
                              onClick={(e) => handleRemoveSavedJob(e, job.id)}
                              title="Remove from saved"
                            >
                              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
                            {job.workLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="line-clamp-1">  {[job.city, job.country].filter(Boolean).join(', ')}</span>
                              </div>
                            )}
                            {job.jobType && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="line-clamp-1">{job.jobType}</span>
                              </div>
                            )}
                            {job.salaryMin && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>{job.salaryCurrency} {job.salaryMin.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="whitespace-nowrap">Saved {formatTimeAgo(job.savedAt || '')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-2 sm:px-4 text-xs sm:text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <JobRightSidebar
            suggestedJobs={suggestedJobs}
            loadingSuggestions={loadingSuggestions}
            formatTimeAgo={formatTimeAgo}
            currentUserId={currentUser?.id}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-[400px] bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 bg-white border-b">
                  <h3 className="text-lg font-bold">Menu</h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pb-20">
                  <JobRightSidebar
                    suggestedJobs={suggestedJobs}
                    loadingSuggestions={loadingSuggestions}
                    formatTimeAgo={formatTimeAgo}
                    currentUserId={currentUser?.id}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
