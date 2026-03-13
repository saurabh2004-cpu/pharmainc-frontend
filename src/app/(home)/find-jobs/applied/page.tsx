"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAllUserApplications } from '@/lib/api/services/job';
import { getInstitutionById } from '@/lib/api/services/institute';
import { listJobs } from '@/lib/api/services/job';
import { respondToNextRound, interviewDecision } from '@/lib/api/services/application';
import { downloadResume } from '@/lib/api/services/user';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Application, Job, Institution } from '@/lib/api/types';
import JobRightSidebar from '../_components/JobRightSidebar';
import { buildImageUrl } from '@/utils/buildImageUrl';
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Building2,
  Calendar,
  FileText,
  Eye,
  Download,
  ChevronUp,
  ChevronDown,
  Video,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ApplicationWithJob extends Application {
  jobTitle?: string;
  jobLocation?: string;
  jobType?: string;
  companyName?: string;
  companyLogo?: string | null;
  jobWorkLocation?: string;
  jobCity?: string | null;
  jobCountry?: string | null;
}

interface JobWithInstitution extends Job {
  institution?: Institution;
}

// Application Status Enum values for UI - MATCHING BACKEND ENUM EXACTLY
const APPLICATION_STATUSES = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'NEXT_ROUND_REQUESTED', label: 'Next Round Requested' },
  { value: 'NEXT_ROUND_ACCEPTED', label: 'Next Round Accepted' },
  { value: 'NEXT_ROUND_REJECTED', label: 'Next Round Rejected' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { value: 'INTERVIEW_ACCEPTED', label: 'Interview Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'HIRED', label: 'Hired' },
];

const TAB_CONFIG = [
  {
    id: 'all',
    label: 'All',
    filter: (status: string) => true
  },
  {
    id: 'SHORTLISTED',
    label: 'Shortlisted',
    filter: (status: string) => status === 'SHORTLISTED'
  },
  {
    id: 'NEXT_ROUND_REQUESTED',
    label: 'Next Round Requested',
    filter: (status: string) => status === 'NEXT_ROUND_REQUESTED'
  },
  {
    id: 'INTERVIEW_SCHEDULED',
    label: 'Interview Scheduled',
    filter: (status: string) => status === 'INTERVIEW_SCHEDULED'
  },
  {
    id: 'HIRED',
    label: 'Hired',
    filter: (status: string) => status === 'HIRED'
  },
  {
    id: 'REJECTED',
    label: 'Rejected',
    filter: (status: string) => status === 'REJECTED'
  },
];

const AppliedJobsPage = () => {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filtering and Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('applied_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Processing State for downloads
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Suggested Jobs State
  const [suggestedJobs, setSuggestedJobs] = useState<JobWithInstitution[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  // Fetch Function
  const fetchApplications = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch ALL applications for the user (No backend filtering)
      const apps = await getAllUserApplications(currentUser.id);

      // 2. Enrich with detailed info (Institute Name/Logo if missing)
      const applicationsWithDetails: ApplicationWithJob[] = await Promise.all(
        apps.map(async (app: Application) => {
          const job = app.job as Job | undefined; // Cast to Job if needed
          let instituteName = 'Company Name';
          let instituteLogo: string | null = null;
          let jobTitle = 'Job Title Not Available';
          let jobLocation = 'Location not specified';
          let jobType = 'Not specified';
          let jobWorkLocation = '';
          let jobCity: string | null = null;
          let jobCountry: string | null = null;

          // Attempt to extract data from embedded job object
          if (job) {
            jobTitle = job.title;
            jobLocation = job.location || job.workLocation || jobLocation;
            jobType = job.jobType || jobType;
            jobWorkLocation = job.workLocation;
            jobCity = job.city || null;
            jobCountry = job.country || null;

            if (job.institute) {
              instituteName = job.institute.name;
              // Use profile_picture mapped from backend (instituteImages)
              instituteLogo = (job.institute as any).profile_picture || null;
            } else if (job.instituteId) {
              // Determine if we need to fetch institute details separately
              try {
                const institute = await getInstitutionById(job.instituteId);
                instituteName = institute.name;
                instituteLogo = institute.profile_picture || null;
              } catch (error) {
                console.error(`Failed to fetch institute ${job.instituteId}:`, error);
              }
            }
          }

          return {
            ...app,
            jobTitle,
            jobLocation,
            jobType,
            companyName: instituteName,
            companyLogo: instituteLogo,
            jobWorkLocation,
            jobCity,
            jobCountry,
          };
        })
      );

      setApplications(applicationsWithDetails);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      // Handle gracefully
      if (err.response?.status === 404) {
        setApplications([]);
      } else {
        setError(err.response?.data?.error || 'Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchSuggestedJobs = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await listJobs(1, 10, undefined, undefined, undefined, 'active');
      const allJobs = response.data;
      const shuffledJobs = [...allJobs].sort(() => Math.random() - 0.5);
      const randomThree = shuffledJobs.slice(0, 3);
      setSuggestedJobs(randomThree);
    } catch (error) {
      console.error('Failed to fetch suggested jobs:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    if (!currentUser?.id) {
      // Ideally trigger a fetch or redirect if not authorized, but assuming store handles auth check
      useUserStore.getState().fetchCurrentUser();
      return;
    }

    fetchApplications();

    if (suggestedJobs.length === 0) {
      fetchSuggestedJobs();
    }
  }, [currentUser, fetchApplications]);

  // Handle Response to Next Round
  const handleNextRoundResponse = async (appId: string, status: 'accept' | 'reject') => {
    try {
      setActionLoading(appId);
      await respondToNextRound(appId, status);

      toast.success(status === 'accept' ? 'Next round accepted' : 'Next round rejected');

      // Optimistic update
      setApplications(prev => prev.map(app =>
        app.id === appId ? { ...app, status: status } : app
      ));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Interview Decision
  const handleInterviewResponse = async (appId: string, decision: 'accept' | 'reject') => {
    try {
      setActionLoading(appId);
      await interviewDecision(appId, decision);

      toast.success(decision === 'accept' ? 'Interview accepted' : 'Interview rejected');

      // Optimistic update - Match the resulting status from backend logic
      // Accept -> INTERVIEW_ACCEPTED
      // Reject -> REJECTED
      const newStatus = decision === 'accept' ? 'INTERVIEW_ACCEPTED' : 'REJECTED';

      setApplications(prev => prev.map(app =>
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // --- Derived State for Client-Side Filtering ---
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // 1. Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(app =>
        app.jobTitle?.toLowerCase().includes(lowerTerm) ||
        app.companyName?.toLowerCase().includes(lowerTerm) ||
        app.jobLocation?.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Status Filter (Client-Side)
    if (statusFilter !== 'all') {
      const activeTab = TAB_CONFIG.find(t => t.id === statusFilter);
      if (activeTab) {
        result = result.filter(app => activeTab.filter(app.status || 'APPLIED'));
      } else {
        // Fallback for Select filter values not in TAB_CONFIG
        result = result.filter(app => app.status === statusFilter);
      }
    }

    return result;
  }, [applications, searchTerm, statusFilter]);

  // --- Derived State for Sorting ---
  const sortedApplications = useMemo(() => {
    const sorted = [...filteredApplications];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'jobTitle':
          aValue = a.jobTitle || '';
          bValue = b.jobTitle || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'applied_at':
        default:
          // Support multiple date fields for robustness
          aValue = new Date(a.applied_at || a.appliedDate || a.created_at || 0).getTime();
          bValue = new Date(b.applied_at || b.appliedDate || b.created_at || 0).getTime();
          break;
      }

      if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
    return sorted;
  }, [filteredApplications, sortField, sortDirection]);

  // --- Pagination ---
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedApplications.slice(startIndex, endIndex);
  }, [sortedApplications, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);

  // --- Helpers ---
  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'secondary';
    // Mapping specific statuses to badge variants
    switch (status) {
      case 'APPLIED': return 'secondary';
      case 'SHORTLISTED': return 'default'; // often primary color
      case 'NEXT_ROUND_REQUESTED': return 'outline';
      case 'NEXT_ROUND_ACCEPTED': return 'default';
      case 'NEXT_ROUND_REJECTED': return 'destructive';
      case 'INTERVIEW_SCHEDULED': return 'default';
      case 'INTERVIEW_ACCEPTED': return 'default';
      case 'REJECTED': return 'destructive';
      case 'HIRED': return 'default'; // Success color usually
      default: return 'secondary';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-[blue-500]', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];
    return colors[name.charCodeAt(0) % colors.length];
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

  // Processing helpers
  const addToProcessing = (id: string) => setProcessingIds(prev => [...prev, id]);
  const removeFromProcessing = (id: string) => setProcessingIds(prev => prev.filter(pid => pid !== id));
  const isProcessing = (id: string) => processingIds.includes(id);

  // const handleDownloadResume = async (userId: string | undefined, userName: string) => {
  //   if (!userId) {
  //     toast.error("Cannot download resume: User ID missing");
  //     return;
  //   }

  //   const processingKey = `download-${userId}`;
  //   if (isProcessing(processingKey)) return;

  //   addToProcessing(processingKey);
  //   try {
  //     const blob = await downloadResume(userId);

  //     // Create URL
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;

  //     // Determine extension
  //     const type = blob.type;
  //     let extension = 'pdf';
  //     if (type === 'application/msword') extension = 'doc';
  //     if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') extension = 'docx';

  //     link.setAttribute('download', `${userName.replace(/\s+/g, '_')}_Resume.${extension}`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);

  //     toast.success('Resume downloaded successfully');
  //   } catch (error: any) {
  //     console.error('Download error:', error);
  //     if (error.response && error.response.status === 404) {
  //       toast.error("Resume not uploaded by applicant");
  //     } else {
  //       toast.error("Failed to download resume");
  //     }
  //   } finally {
  //     removeFromProcessing(processingKey);
  //   }
  // };

  const handleDownloadResume = async (resumeUrl) => {
    window.open(resumeUrl, '_blank');
  }

  if (loading && applications.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
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
              <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Find Jobs
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Applied Jobs</h1>
              <p className="text-gray-600 mt-2">Track and manage your job applications</p>
            </div>

            {/* Status Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar bg-white rounded-lg p-1 shadow-sm">
              {TAB_CONFIG.map((tab) => {
                const isActive = statusFilter === tab.id;
                const count = applications.filter(app => tab.filter(app.status || 'APPLIED')).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setStatusFilter(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`
                                flex items-center justify-center py-2.5 px-6 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-md
                                ${isActive
                        ? 'bg-[#398865] text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }
                            `}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filter Section */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by job title, company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            {sortedApplications.length === 0 && !loading ? (
              <Card className="p-12">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : "You haven't applied to any jobs yet"}
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button onClick={() => router.push('/find-jobs')}>Browse Jobs</Button>
                  )}
                </div>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Applications ({sortedApplications.length})</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
                        <Select value={sortField} onValueChange={setSortField}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applied_at">Date Applied</SelectItem>
                            <SelectItem value="jobTitle">Job Title</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {paginatedApplications.map((application) => (
                        <div key={application.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              {/* Institute logo: image if available, else colored initial */}
                              {application.companyLogo ? (
                                <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden border border-gray-100">
                                  <Image
                                    src={buildImageUrl(application.companyLogo)}
                                    alt={application.companyName || 'Institute'}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ) : (
                                <UserAvatar name={application.companyName} className="h-12 w-12 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
                                <p className="text-sm text-gray-600 mb-2">{application.companyName}</p>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                  {application.jobLocation && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      <span>
                                        {(application.jobWorkLocation?.toLowerCase() === 'on-site' || application.jobWorkLocation?.toLowerCase() === 'onsite') && (application.jobCity || application.jobCountry)
                                          ? `${[application.jobCity, application.jobCountry].filter(Boolean).join(', ')}`
                                          : application.jobLocation}
                                      </span>
                                    </div>
                                  )}
                                  {application.jobType && (
                                    <div className="flex items-center gap-1">
                                      <Building2 className="h-4 w-4" />
                                      <span>{application.jobType}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Applied: {formatDate(application.applied_at || application.appliedDate || application.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-3">
                              <Badge variant={getStatusBadgeVariant(application.status)}>
                                {application.status?.replace(/_/g, ' ') || 'PENDING'}
                              </Badge>

                              {/* Respond to Next Round Buttons */}
                              {application.status === 'NEXT_ROUND_REQUESTED' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleNextRoundResponse(application.id, 'accept')}
                                    disabled={actionLoading === application.id}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleNextRoundResponse(application.id, 'reject')}
                                    disabled={actionLoading === application.id}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}

                              {/* Respond to Interview Schedule - REMOVED as per new flow */}
                              {/* Users no longer respond to INTERVIEW_SCHEDULED */}
                              {/* Institute now directly finalizes after scheduling */}

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => router.push(`/find-jobs/${application.jobTitle?.split(' ').join('-')}?id=${application.jobId}`)}>
                                  <Eye className="mr-1 h-4 w-4" /> View Job
                                </Button>
                                {(application.resume_url || application.resumeUrl) && (
                                  <Button variant="outline" size="sm" onClick={() => handleDownloadResume(application.resume_url || application.resumeUrl)}>
                                    <Download className="mr-1 h-4 w-4" /> Resume
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Interview Details Section */}
                          {application.status === 'INTERVIEW_SCHEDULED' && (() => {
                            const details = (application.additionalDetails as any) || {};
                            const interview = application.interviews && application.interviews[0];

                            const type = details.interviewType || interview?.interviewType || "";
                            const date = details.interviewDate || (interview?.interviewDate ? formatDate(interview.interviewDate) : "");
                            const time = details.interviewTime || (interview?.interviewTime ? new Date(interview.interviewTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "");
                            const link = details.interviewLink || interview?.interviewLink;

                            const isVideo = type.toLowerCase().includes('video');

                            return (
                              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full shadow-sm text-green-600">
                                      {isVideo ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-green-900">
                                        {isVideo ? 'Video Interview Scheduled' : 'Phone Interview Scheduled'}
                                      </h4>
                                      <p className="text-sm text-green-700 mt-0.5">
                                        {isVideo
                                          ? "Your video interview has been confirmed. Please join using the button below."
                                          : "The interviewer will call you at the scheduled time. Please ensure you are available at this time."}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-medium text-green-800">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-4 w-4" />
                                          <span>{date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <div className="rounded-full h-1 w-1 bg-green-400" />
                                          <span>{time}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {isVideo && link && (
                                    <Button
                                      className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                                      onClick={() => window.open(link.startsWith('http') ? link : `https://${link}`, '_blank')}
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" /> Join Interview
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {(application.cover_letter || application.coverLetter) && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm text-gray-700 line-clamp-2">
                                <span className="font-medium">Cover Letter: </span>
                                {application.cover_letter || application.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedApplications.length)} of {sortedApplications.length} applications
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)} className="w-10">
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                  </div>
                )}
              </>
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

export default AppliedJobsPage;
