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
  Briefcase
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
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:gap-6 p-4 sm:p-6">
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:gap-6">
        <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[calc(100%-22rem)]">
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 pl-0 hover:pl-2 transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Jobs</h1>
              <p className="text-gray-600 mt-2">Jobs you have bookmarked for later</p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
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
                      <SelectTrigger className="w-32 sm:w-40">
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
                    >
                      {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {sortedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg border border-gray-200 border-dashed">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10 text-blue-300" />
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
                    className="bg-blue-600 hover:bg-blue-700"
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
                    className="hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => router.push(`/find-jobs/${generateSlug(job as Job)}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Institute logo: image if available, else colored initial */}
                        {job.companyLogo ? (
                          <div className="h-12 w-12 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src={buildImageUrl(job.companyLogo)}
                              alt={job.companyName || 'Institute'}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <UserAvatar name={job.companyName} className="h-12 w-12 rounded-lg border border-gray-100" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 mb-2">{job.companyName}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 -mt-1 -mr-2"
                              onClick={(e) => handleRemoveSavedJob(e, job.id)}
                              title="Remove from saved"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {job.workLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {/* {job.workLocation} */}
                                <span>  {[job.city, job.country].filter(Boolean).join(', ')}</span>
                              </div>
                            )}
                            {job.jobType && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {job.jobType}
                              </div>
                            )}
                            {job.salaryMin && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salaryCurrency} {job.salaryMin.toLocaleString()}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Saved {formatTimeAgo(job.savedAt || '')}
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
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <JobRightSidebar
          suggestedJobs={suggestedJobs}
          loadingSuggestions={loadingSuggestions}
          formatTimeAgo={formatTimeAgo}
          currentUserId={currentUser?.id}
        />
      </div>
    </div>
  );
};

export default SavedJobsPage;
