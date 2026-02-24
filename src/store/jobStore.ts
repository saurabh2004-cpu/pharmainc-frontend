import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Job } from '@/lib/api/types'
import { listJobs, getJob, searchJobs } from '@/lib/api/services/job'
import { getInstitutionById } from '@/lib/api/services/institute'
import { Institution } from '@/lib/api/types'

interface JobWithInstitution extends Job {
  institution?: Institution
}

interface JobFilters {
  searchQuery?: string
  jobType?: string
  location?: string
  experienceLevel?: string
  status?: string
}

interface JobState {
  jobs: JobWithInstitution[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  currentPage: number
  hasMore: boolean
  totalPages: number
  totalJobs: number
  filters: JobFilters

  fetchJobs: (page?: number, pageSize?: number, append?: boolean, filters?: JobFilters) => Promise<void>
  fetchSingleJob: (jobId: string) => Promise<{ job: JobWithInstitution; matchingScore: number | null } | null>
  loadMoreJobs: () => Promise<void>
  clearJobs: () => void
  setJobs: (jobs: JobWithInstitution[]) => void
  setFilters: (filters: JobFilters) => void
  addJob: (job: JobWithInstitution) => void
  refreshJobs: () => Promise<void>
}

export const useJobStore = create<JobState>()(
  devtools(
    (set, get) => ({
      jobs: [],
      loading: false,
      loadingMore: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      totalPages: 0,
      totalJobs: 0,
      filters: { status: 'active' },

      fetchJobs: async (page = 1, pageSize = 20, append = false, filters?: JobFilters) => {
        if (append) {
          set({ loadingMore: true, error: null })
        } else {
          set({ loading: true, error: null, jobs: [] })
        }

        const currentFilters = filters || get().filters
        set({ filters: currentFilters })

        try {
          let response;

          // Split location filter into work_location vs generic location
          let workLocationParam: string | undefined;
          let locationParam: string | undefined;

          if (currentFilters.location && currentFilters.location !== 'all') {
            const lowerLoc = currentFilters.location.toLowerCase();
            if (['Remote', 'Hybrid', 'On-site'].includes(lowerLoc)) {
              // Map "onsite" to "On-site" for backend consistency if needed, assuming Standard
              workLocationParam = lowerLoc === 'onsite' ? 'On-site' : currentFilters.location;
            } else {
              locationParam = currentFilters.location;
            }
          }

          // Use search API if we have a search query OR a specific work location filter
          if ((currentFilters.searchQuery && currentFilters.searchQuery.trim()) || workLocationParam) {
            // Use search API
            // Map filters to search params (snake_case)
            response = await searchJobs({
              q: currentFilters.searchQuery,
              work_location: workLocationParam,
              location: locationParam,
              experience_level: currentFilters.experienceLevel === 'all' ? undefined : currentFilters.experienceLevel,
              active: currentFilters.status === 'active',
              page,
              limit: pageSize,
              // Pass jobType even if not explicitly typed in JobSearchParams, or map it if backend supports it
              // Based on types, it might not be supported. We'll skip it or try to pass it if we can.
              // If jobType is critical and missing from search, we might need client side filtering? 
              // For now, let's assume search is primary.
            } as any); // Type assertion to pass extra params if needed
          } else {
            // Use list API
            response = await listJobs(
              page,
              pageSize,
              currentFilters.jobType === 'all' ? undefined : currentFilters.jobType,
              locationParam, // Only pass generic location here
              currentFilters.experienceLevel === 'all' ? undefined : currentFilters.experienceLevel,
              currentFilters.status === 'all' ? undefined : currentFilters.status
            )
          }

          // The API response already includes institute information
          const jobsWithInstitutions: JobWithInstitution[] = response.data.map(job => ({
            ...job,
            institution: job.institute ? {
              id: job.institute.id,
              name: job.institute.name,
              location: job.institute.location,
              type: job.institute.role || 'HOSPITAL',
              created_at: job.institute.created_at,
              updated_at: (job.institute as any).updated_at || job.institute.created_at,
              verified: job.institute.verified,
              contact_email: job.institute.contactEmail,
              contact_number: job.institute.contactNumber,
              about: job.institute.about,
              profile_picture: (job.institute as any).profile_picture || null, // CloudFront image URL
            } as Institution : undefined,
            location: job.workLocation, // Map workLocation to location for compatibility
            institute_id: job.instituteId, // Map instituteId for compatibility
            pay_range: job.salaryMin && job.salaryMax ?
              `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}` :
              'Not specified'
          }))

          if (append) {
            set((state) => ({
              jobs: [...state.jobs, ...jobsWithInstitutions],
              loadingMore: false,
              currentPage: page,
              hasMore: response.pagination.hasNext,
              totalPages: response.pagination.totalPages,
              totalJobs: response.pagination.total
            }))
          } else {
            set({
              jobs: jobsWithInstitutions,
              loading: false,
              currentPage: page,
              hasMore: response.pagination.hasNext,
              totalPages: response.pagination.totalPages,
              totalJobs: response.pagination.total
            })
          }
        } catch (error) {
          console.error('Failed to fetch jobs:', error)
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch jobs',
            loading: false,
            loadingMore: false
          })
        }
      },

      fetchSingleJob: async (jobId: string) => {
        try {
          const { job, matchingScore } = await getJob(jobId)

          // Common job transformation
          let processedJob: JobWithInstitution = {
            ...job,
            location: job.workLocation,
            institute_id: job.instituteId
          };

          if (processedJob.salaryMin && processedJob.salaryMax) {
            processedJob.pay_range = `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
          } else {
            processedJob.pay_range = 'Not specified';
          }

          if (job.institute) {
            processedJob.institution = {
              id: job.institute.id,
              name: job.institute.name,
              location: job.institute.location,
              type: job.institute.role || 'HOSPITAL',
              created_at: job.institute.created_at,
              updated_at: job.institute.created_at,
              verified: job.institute.verified,
              contact_email: job.institute.contactEmail,
              contact_number: job.institute.contactNumber,
              about: job.institute.about,
              profile_picture: (job.institute as any).profile_picture || null, // CloudFront image URL
            } as Institution;
          } else {
            const instituteId = job.instituteId || job.institute_id
            if (instituteId) {
              const institution = await getInstitutionById(instituteId);
              processedJob.institution = institution;
            }
          }

          return { job: processedJob, matchingScore: matchingScore ?? null };
        } catch (error) {
          console.error('Failed to fetch job:', error)
          return null
        }
      },

      loadMoreJobs: async () => {
        const { currentPage, hasMore, loadingMore, filters } = get()
        if (!hasMore || loadingMore) return

        await get().fetchJobs(currentPage + 1, 20, true, filters)
      },

      clearJobs: () => {
        set({
          jobs: [],
          loading: false,
          loadingMore: false,
          error: null,
          currentPage: 1,
          hasMore: true,
          totalPages: 0,
          totalJobs: 0
        })
      },

      setJobs: (jobs: JobWithInstitution[]) => {
        set({ jobs })
      },

      setFilters: (filters: JobFilters) => {
        set({ filters })
      },

      addJob: (job: JobWithInstitution) => {
        set((state) => ({
          jobs: [job, ...state.jobs],
          totalJobs: state.totalJobs + 1
        }))
      },

      refreshJobs: async () => {
        const { currentPage, filters } = get()
        await get().fetchJobs(currentPage, 20, false, filters)
      }
    }),
    {
      name: 'job-store'
    }
  )
)
