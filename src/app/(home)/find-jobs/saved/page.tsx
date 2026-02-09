"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSavedJobs } from '@/lib/api/services/job'; // We need this or use store
import { listJobs } from '@/lib/api/services/job';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job, Institution } from '@/lib/api/types';
import JobRightSidebar from '../_components/JobRightSidebar';
import {
    ArrowLeft,
    Search,
    MapPin,
    Building2,
    Calendar,
    FileText,
    Eye,
    Trash2,
    ChevronUp,
    ChevronDown,
    DollarSign
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface SavedJobWithDetails extends Job {
    savedJobId?: string; // ID of the saved_job record
    savedAt?: string;
    institution?: Institution;
    companyName?: string;
    companyLogo?: string | null;
    jobId?: string;
}

// Helper for type safety if needed, assuming backend returns { id, job: Job, created_at ... }
interface SavedJobResponseItem {
    id: string;
    jobId: string;
    userId: string;
    created_at: string;
    job?: Job; // Assuming usage of include: { job: true } in backend
}

const SavedJobsPage = () => {
    const router = useRouter();
    const { currentUser, toggleSavedJob, fetchSavedJobs: updateStoreSavedJobs } = useUserStore();

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

    useEffect(() => {
        if (!currentUser?.id) {
            // Try to fetch current user if not ready, or redirect? 
            // Usually layout handles auth, but safety check:
            // useUserStore.getState().fetchCurrentUser(); 
            // If still loading, wait.
            return;
        }
        fetchSavedJobsList();
        fetchSuggestedJobs();
    }, [currentUser]);

    const fetchSavedJobsList = async () => {
        if (!currentUser?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Call API directly to get the list with details
            const response = await getSavedJobs(currentUser.id);

            // Transform response to useful shape
            // Assuming response is SavedJobResponseItem[]
            const transformedJobs: SavedJobWithDetails[] = response.map((item: any) => {
                const job = item.job || {};
                const institute = job.institute || {}; // If included

                return {
                    ...job, // Spread job details
                    savedJobId: item.id,
                    savedAt: item.created_at,
                    jobId: item.jobId || job.id, // Ensure ID is correct
                    companyName: institute.name || 'Company Name',
                    companyLogo: institute.profile_picture || null,
                    institution: institute
                };
            });

            setSavedJobs(transformedJobs);

            // Also update store to sync state
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

            // Shuffle the jobs and take random 3
            const shuffledJobs = [...allJobs].sort(() => Math.random() - 0.5);
            const randomThree = shuffledJobs.slice(0, 3);

            setSuggestedJobs(randomThree);
        } catch (error) {
            console.error('Failed to fetch suggested jobs:', error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleRemoveSavedJob = async (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation(); // Prevent card click
        if (!currentUser) return;

        try {
            // Optimistic update
            const prevJobs = [...savedJobs];
            setSavedJobs(current => current.filter(job => job.id !== jobId && job.jobId !== jobId));

            await toggleSavedJob(jobId);
            toast.success('Job removed from saved list');

            // No need to refetch full list if toggleSavedJob works, 
            // but if we want strictly consistent state we could. 
            // Relying on optimistic for now for better UX.
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
                    // Rough estimate if min salary exists
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

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-7xl">
                <Skeleton className="h-10 w-32 mb-6" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 max-w-7xl text-center">
                <h2 className="text-xl text-red-600">{error}</h2>
                <Button onClick={fetchSavedJobsList} className="mt-4">Retry</Button>
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
                                className="mb-4"
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
                                            <SelectTrigger className="w-40">
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
                            <Card className="p-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Jobs</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm ? "No matches found for your search." : "You haven't saved any jobs yet."}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => router.push('/find-jobs')}>Browse Jobs</Button>
                                )}
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {paginatedJobs.map((job) => (
                                    <Card key={job.savedJobId || job.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/find-jobs/${job.jobId || job.id}`)}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar className="h-12 w-12 rounded-lg">
                                                    {job.companyLogo && <AvatarImage src={job.companyLogo} />}
                                                    <AvatarFallback className={`rounded-lg text-white ${getAvatarColor(job.companyName || 'C')}`}>
                                                        {job.companyName?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.title}</h3>
                                                            <p className="text-gray-600 mb-2">{job.companyName}</p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2"
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
                                                                {job.workLocation}
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
                                                                {job.salaryCurrency} {job.salaryMin.toLocaleString()} - {job.salaryMax?.toLocaleString()}
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
                                        <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                                        <span className="flex items-center px-4 text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                                        <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
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
