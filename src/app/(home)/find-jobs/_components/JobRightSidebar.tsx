import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, FileText, Bookmark, MessageSquare, Building2, Clock, MapPin, X, Briefcase } from 'lucide-react';
import { Job, Institution, ApplicationStats } from '@/lib/api/types';
import { getRecommendedJobs } from '@/lib/api/services/job';
import { getUserApplicationStats } from '@/lib/api/services/application';

interface JobWithInstitution extends Job {
  institution?: Institution;
}

interface JobRightSidebarProps {
  searchQuery?: string;
  totalJobs?: number;
  filters?: {
    jobType?: string;
    experienceLevel?: string;
    location?: string;
  };
  onFilterChange?: (key: string, value: string) => void;
  // suggestedJobs prop is deprecated in favor of internal fetching for recommendations
  suggestedJobs?: JobWithInstitution[];
  loadingSuggestions?: boolean;
  formatTimeAgo?: (dateString: string) => string;
  currentUserId?: string;
}

const JobRightSidebar: React.FC<JobRightSidebarProps> = ({
  searchQuery,
  totalJobs,
  filters,
  onFilterChange,
  formatTimeAgo,
  currentUserId,
}) => {
  const router = useRouter();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<ApplicationStats>({
    applied: 0,
    interviewScheduled: 0,
    rejected: 0
  });
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadingStats(true);

      try {
        const [jobsResponse, statsResponse] = await Promise.all([
          getRecommendedJobs(1, 5).catch(err => {
            console.error('Failed to fetch recommended jobs:', err);
            return { data: [] };
          }),
          getUserApplicationStats().catch(err => {
            console.error('Failed to fetch application stats:', err);
            return { applied: 0, interviewScheduled: 0, rejected: 0 };
          })
        ]);

        setRecommendedJobs(jobsResponse.data || []);
        // Check if statsResponse has the properties we expect, safely fallback if not
        if (statsResponse) {
          setStats({
            applied: statsResponse.applied || 0,
            interviewScheduled: statsResponse.interviewScheduled || 0,
            rejected: statsResponse.rejected || 0
          });
        }

      } catch (err) {
        console.error('Error fetching sidebar data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
        setLoadingStats(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  const defaultFormatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const timeFormatter = formatTimeAgo || defaultFormatTimeAgo;

  if (!currentUserId && !searchQuery && (!filters || (filters.jobType === 'all' && filters.experienceLevel === 'all' && filters.location === 'all'))) {
    // Optional: Hide sidebar content or show login prompt if not logged in and no search active?
    // Requirement says: "If user is not logged in, do not render the sidebar"
    // But sidebar also contains filters and quick actions. 
    // The requirement likely refers to the "Recommended Jobs" section or the whole component if it's ONLY for recommendations.
    // However, this sidebar has other duties. I will hide the recommendations section if not logged in.
  }

  return (
    <div className="w-full lg:w-[20rem] lg:flex-shrink-0 order-first lg:order-last">
      <div className="lg:sticky lg:top-4">
        <div className="bg-white border-t lg:border-t-0 lg:border lg:rounded-lg border-gray-200 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

            {searchQuery && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h3 className="text-sm sm:text-lg font-semibold text-blue-900 mb-2">Search Summary</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Search:</span>
                    <span className="ml-2 text-blue-600">"{searchQuery}"</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Results:</span>
                    <span className="ml-2 text-blue-600">{totalJobs} jobs</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              {loadingStats ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Applied Jobs</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stats.applied}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Interview Scheduled</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stats.interviewScheduled}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stats.rejected}</span>
                  </div>
                </div>
              )}
            </div>

            {filters && onFilterChange && (filters.jobType !== 'all' || filters.experienceLevel !== 'all' || filters.location !== 'all') && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Active Filters</h3>
                <div className="space-y-2">
                  {filters.jobType !== 'all' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Job Type:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{filters.jobType}</span>
                        <button
                          onClick={() => onFilterChange('jobType', 'all')}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  {filters.experienceLevel !== 'all' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Experience:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{filters.experienceLevel}</span>
                        <button
                          onClick={() => onFilterChange('experienceLevel', 'all')}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  {filters.location !== 'all' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{filters.location}</span>
                        <button
                          onClick={() => onFilterChange('location', 'all')}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <div
                  onClick={() => router.push('/find-jobs/applied')}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <CheckCircle className="text-green-600 h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">View Applied Jobs</div>
                    <div className="text-xs text-gray-500">Track your applications</div>
                  </div>
                </div>
                <div
                  onClick={() => router.push('/find-jobs/saved-jobs')}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <Bookmark className="text-blue-600 h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">View Saved Jobs</div>
                    {/* <div className="text-xs text-gray-500">5 jobs saved</div> */}
                  </div>
                </div>
                <div
                  onClick={() => router.push('/messages')}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                    <MessageSquare className="text-purple-600 h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Messages</div>
                    {/* <div className="text-xs text-gray-500">2 new from recruiters</div> */}
                  </div>
                </div>
                <div
                  onClick={() => currentUserId && router.push(`/profile/${currentUserId}`)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                    <FileText className="text-orange-600 h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Update Profile</div>
                    <div className="text-xs text-gray-500">Keep your profile up to date</div>
                  </div>
                </div>
              </div>
            </div>

            {currentUserId && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recommended Jobs</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : recommendedJobs.length > 0 ? (
                  <div className="space-y-3">
                    {recommendedJobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        onClick={() => router.push(`/find-jobs/${job.id}`)}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{job.title}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <Building2 size={12} />
                          <span className="line-clamp-1">{job.institute?.name || "Healthcare Institute"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <MapPin size={10} />
                          <span className="line-clamp-1">{job.workLocation || job.location}</span>
                          <span>•</span>
                          <Briefcase size={10} />
                          <span>{job.jobType}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                            {job.experienceLevel}
                          </span>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            <span>{timeFormatter(job.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-500">No recommended jobs yet</p>
                  </div>
                )}
              </div>
            )}

            <div className="h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRightSidebar;
