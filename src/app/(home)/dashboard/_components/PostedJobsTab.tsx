"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, FileText, CheckCircle, Calendar, Search, MoreVertical } from 'lucide-react'
import { FaEye, FaEdit, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MetricCard } from './MetricCard'
import { getInstituteJobs } from '@/lib/api/services/job'
import { useInstitutionStore } from '@/store'
import { Job, PaginatedResponse } from '@/lib/api/types'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { updateJob, renewJob, toggleJobStatus } from '@/lib/api/services/job'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'

export const PostedJobsTab = () => {
  const router = useRouter()
  const { currentInstitution, fetchCurrentInstitution } = useInstitutionStore()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [jobToRenew, setJobToRenew] = useState<Job | null>(null)
  const [renewing, setRenewing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const pageSize = 10

  // Fetch current institution on mount to ensure store is hydrated
  useEffect(() => {
    fetchCurrentInstitution()
  }, [fetchCurrentInstitution])

  useEffect(() => {
    fetchJobs()
  }, [currentInstitution, currentPage, statusFilter])

  const fetchJobs = async () => {
    if (!currentInstitution?.id) {
      setLoading(false)
      setError('Institution ID not found')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response: PaginatedResponse<Job> = await getInstituteJobs(
        currentInstitution.id,
        currentPage,
        pageSize,
        undefined,
        statusFilter === 'all' ? undefined : statusFilter
      )

      setJobs(response.data)
      setTotalJobs(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      console.error('Error fetching institute jobs:', err)
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) {
      return `${currency || '$'} ${min.toLocaleString()} - ${max.toLocaleString()}`
    }
    return `${currency || '$'} ${(min || max).toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'closed': 'bg-red-100 text-red-800',
      'paused': 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={`text-xs px-2 py-1 ${statusColors[status as keyof typeof statusColors] || statusColors.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleViewApplications = (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}/applicants`)
  }

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.shortDescription?.toLowerCase().includes(searchLower) ||
      job.workLocation?.toLowerCase().includes(searchLower) ||
      job.jobType?.toLowerCase().includes(searchLower)
    )
  })

  // Job status toggle handler
  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    // Optimistic update
    setJobs(prevJobs => prevJobs.map(job =>
      job.id === jobId ? { ...job, status: newStatus } : job
    ))

    try {
      await toggleJobStatus(jobId)
      toast.success(`Job status updated`)
    } catch (err) {
      console.error('Error updating status:', err)
      // Revert optimistic update
      setJobs(prevJobs => prevJobs.map(job =>
        job.id === jobId ? { ...job, status: currentStatus } : job
      ))
      toast.error('Failed to update job status')
    }
  }

  // Renew job handler
  const handleRenewConfirm = async () => {
    if (!jobToRenew) return

    try {
      setRenewing(true)
      await renewJob(jobToRenew.id)

      // Update local state
      setJobs(prevJobs => prevJobs.map(job =>
        job.id === jobToRenew.id ? { ...job, status: 'active' } : job
      ))

      toast.success('Job renewed successfully')
      setJobToRenew(null)
    } catch (err) {
      console.error('Error renewing job:', err)
      toast.error('Failed to renew job')
    } finally {
      setRenewing(false)
    }
  }

  const activeJobs = jobs.filter(job => job.status === 'active').length
  const totalApplications = jobs.reduce((sum, job) => sum + (Math.floor(Math.random() * 50) + 1), 0) // Mock data
  const filledJobs = jobs.filter(job => job.status === 'closed').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Posted Jobs</h2>
          <p className="text-sm text-gray-600">Manage and track your job postings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Active Jobs"
          value={activeJobs.toString()}
          change={`${jobs.length} total jobs`}
          trend="up"
          icon={FileText}
        />
        <MetricCard
          title="Total Jobs"
          value={jobs.length.toString()}
          change="Across all jobs"
          trend="up"
          icon={Users}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search posted jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: 'all' | 'active' | 'inactive') => {
              setStatusFilter(value)
              setCurrentPage(1) // Reset to first page when filter changes
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posted Jobs</CardTitle>
          <CardDescription>
            Complete list of jobs posted by your institution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading jobs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchJobs} variant="outline">
                Try Again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center p-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No jobs posted yet</p>
              <Button onClick={() => router.push('/dashboard/post-job')}>
                Post Your First Job
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center p-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No jobs found matching your search</p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Job Title</TableHead>
                      <TableHead className="w-[110px]">Job Position</TableHead>
                      <TableHead className="w-[120px]">Speciality</TableHead>
                      {/* <TableHead className="min-w-[150px]">Sub-Speciality</TableHead> */}
                      <TableHead className="w-[120px]">Experience Level</TableHead>
                      {/* <TableHead className="w-32 min-w-[120px]">Location</TableHead> */}
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[120px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-gray-50">

                        <TableCell>
                          <h3
                            className="font-bold text-base leading-tight text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                            onClick={() => router.push(`/dashboard/job/${job.id}`)}
                            title="View Job Details"
                          >
                            {job.title}
                          </h3>
                        </TableCell>

                        <TableCell>
                          <div
                            className="font-medium text-base leading-tight text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                            title="View Job Details"
                          >
                            {job.role}
                          </div>
                        </TableCell>
                        <TableCell className='max-w-[150px]'>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{job.speciality || 'N/A'}</Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">

                            {job.experienceLevel}
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            {job.country ? job.country + ',' + job.city : "'Remote'"}
                          </div>
                        </TableCell> */}
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              {['active', 'inactive'].includes(job.status) ? (
                                <div className="flex items-center gap-2" title="Toggle Status">
                                  <Switch
                                    checked={job.status === 'active'}
                                    onCheckedChange={() => handleToggleStatus(job.id, job.status)}
                                    className="data-[state=checked]:bg-green-600"
                                  />
                                  <span className={`text-xs font-medium ${job.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                                    {job.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              ) : job.status === 'expired' ? (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                                  Expired
                                </Badge>
                              ) : (
                                getStatusBadge(job.status)
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              title="View Applicants"
                              onClick={() => handleViewApplications(job.id)}
                            >
                              <Users className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                  title="Actions"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/job/${job.id}`)}
                                  className="cursor-pointer group"
                                >
                                  <FileText className="w-4 h-4 mr-2 text-gray-600 group-hover:text-blue-600" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/job/${job.id}/edit`)}
                                  className="cursor-pointer group"
                                >
                                  <FaEdit className="w-4 h-4 mr-2 text-gray-600 group-hover:text-green-600" />
                                  Edit
                                </DropdownMenuItem>
                                {job.status === 'expired' && (
                                  <DropdownMenuItem
                                    onClick={() => setJobToRenew(job)}
                                    className="cursor-pointer group text-amber-700 focus:text-amber-800 focus:bg-amber-50"
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Renew Job
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalJobs)} of {totalJobs} jobs
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!jobToRenew} onOpenChange={(open) => !open && setJobToRenew(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renew Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to renew <strong>{jobToRenew?.title}</strong>? Required credits will be deducted from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={renewing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleRenewConfirm()
              }}
              disabled={renewing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {renewing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Renewing...
                </>
              ) : (
                'Confirm Renew'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  )
}
