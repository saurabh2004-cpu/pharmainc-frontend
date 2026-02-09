"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserType } from '@/lib/api/utils';
import { useInstitutionStore } from '@/store';
import { getJob as fetchJob, getJobInstitute } from '@/lib/api/services/job';
import {
    getApplicationsByJob,
    requestNextRound,
    scheduleInterview,
    interviewDecision,
    hire,
    shortlistApplication,
    rejectApplication
} from '@/lib/api/services/application';
import { downloadResume } from '@/lib/api/services/user';
// import { deleteJob } from '@/lib/api/services/job'; // Unused based on previous code

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Application, Job } from '@/lib/api/types';
import {
    Search, Filter, Download, Eye, FileText, ChevronUp, ChevronDown,
    ArrowLeft, Trash2, Mail, Phone, Clock, Briefcase,
    CheckCircle, XCircle, Calendar, UserCheck, X
} from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationWithUserAndJob extends Application {
    userName?: string;
    email?: string;
    phone?: string;
    currentPosition?: string;
    experienceYears?: number | null;
    appliedDate?: string;
    userProfilePicture?: string;
}

const JobApplicationsPage = () => {
    const router = useRouter();
    const params = useParams();
    const jobId = params.jobId as string;
    const { currentInstitution } = useInstitutionStore();
    const [applications, setApplications] = useState<ApplicationWithUserAndJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'all' | 'shortlisted' | 'scheduled' | 'interviewed'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
    const [sortField, setSortField] = useState<string>('appliedDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [processingIds, setProcessingIds] = useState<string[]>([]); // Track processing actions

    useEffect(() => {
        const userType = getUserType();

        if (userType !== 'institution' && userType !== 'institute') {
            // Handle redirect if not institute
        }

        if (currentInstitution?.id && jobId) {
            fetchApplications();
        }
    }, [currentInstitution, jobId]);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            // Fetch Job Details
            const jobDetails = await getJobInstitute(jobId);
            console.log("jobDetails", jobDetails)
            setSelectedJob(jobDetails);

            // Fetch Applications using the new API
            const response = await getApplicationsByJob(jobId);

            const apps = response.applications || response || [];
            console.log("applicants", apps)

            const formattedApps: ApplicationWithUserAndJob[] = apps.map((app: any) => ({
                ...app,
                userName: app.user?.firstName + ' ' + app.user?.lastName || app.user?.name || 'Unknown Candidate',
                email: app.user?.email || 'N/A',
                phone: app.user?.phone || 'N/A',
                userProfilePicture: app.user?.profile_picture,
                currentPosition: app.currentPosition || app.user?.role || 'N/A',
                experienceYears: app.experienceYears || 0,
                appliedDate: app.appliedDate || app.created_at,
                status: app.status || 'APPLIED' // Default status
            }));

            setApplications(formattedApps);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications([]);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplication = (application: ApplicationWithUserAndJob) => {
        // Assuming route exists or will be created
        router.push(`/dashboard/applications/${application.id}`);
    };

    const handleViewResume = (resumeUrl?: string | null) => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        } else {
            toast.info('No resume available');
        }
    };

    // Action Handlers
    const addToProcessing = (id: string) => setProcessingIds(prev => [...prev, id]);
    const removeFromProcessing = (id: string) => setProcessingIds(prev => prev.filter(pid => pid !== id));
    const isProcessing = (id: string) => processingIds.includes(id);

    const updateLocalStatus = (appId: string, newStatus: string) => {
        setApplications(prev => prev.map(app =>
            app.id === appId ? { ...app, status: newStatus as any } : app
        ));
    };

    const handleShortlist = async (appId: string) => {
        if (isProcessing(appId)) return;
        addToProcessing(appId);
        try {
            await shortlistApplication(appId);
            updateLocalStatus(appId, 'SHORTLISTED');
            toast.success('Candidate shortlisted successfully');
        } catch (error) {
            console.error('Error shortlisting candidate:', error);
            toast.error('Failed to shortlist candidate');
        } finally {
            removeFromProcessing(appId);
        }
    };

    const handleReject = async (appId: string) => {
        if (!confirm("Are you sure you want to reject this candidate? This action is irreversible.")) return;
        if (isProcessing(appId)) return;
        addToProcessing(appId);
        try {
            await rejectApplication(appId);
            updateLocalStatus(appId, 'REJECTED');
            toast.success('Candidate rejected');
        } catch (error) {
            console.error('Error rejecting candidate:', error);
            toast.error('Failed to reject candidate');
        } finally {
            removeFromProcessing(appId);
        }
    };

    const handleRequestNextRound = async (appId: string) => {
        if (isProcessing(appId)) return;
        addToProcessing(appId);
        try {
            await requestNextRound(appId);
            updateLocalStatus(appId, 'NEXT_ROUND_REQUESTED');
            toast.success('Next round requested successfully');
        } catch (error) {
            console.error('Error requesting next round:', error);
            toast.error('Failed to request next round');
        } finally {
            removeFromProcessing(appId);
        }
    };

    const handleScheduleInterview = async (appId: string) => {
        if (isProcessing(appId)) return;
        addToProcessing(appId);
        try {
            await scheduleInterview(appId);
            updateLocalStatus(appId, 'INTERVIEW_SCHEDULED');
            toast.success('Interview scheduled successfully');
        } catch (error) {
            console.error('Error scheduling interview:', error);
            toast.error('Failed to schedule interview');
        } finally {
            removeFromProcessing(appId);
        }
    };

    // Interview Decision Logic - REPLACED with Hire/Reject buttons at specific stages
    // const handleInterviewDecision = ... (Deleted as it was mixing concerns for Institute side)

    const handleHire = async (appId: string) => {
        if (isProcessing(appId)) return;
        // specific confirmation for hiring
        if (!confirm("Are you sure you want to hire this candidate?")) return;

        addToProcessing(appId);
        try {
            await hire(appId);
            updateLocalStatus(appId, 'HIRED');
            toast.success('Candidate hired successfully!');
        } catch (error) {
            console.error('Error hiring candidate:', error);
            toast.error('Failed to hire candidate');
        } finally {
            removeFromProcessing(appId);
        }
    };

    // ... (resume download existing)

    const handleDownloadResume = async (userId: string | undefined, userName: string) => {
        if (!userId) {
            toast.error("Cannot download resume: User ID missing");
            return;
        }

        const processingKey = `download-${userId}`;
        if (isProcessing(processingKey)) return;

        addToProcessing(processingKey);
        try {
            const blob = await downloadResume(userId);

            // Create URL
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Determine extension
            const type = blob.type;
            let extension = 'pdf';
            if (type === 'application/msword') extension = 'doc';
            if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') extension = 'docx';

            link.setAttribute('download', `${userName.replace(/\s+/g, '_')}_Resume.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Resume downloaded successfully');
        } catch (error: any) {
            console.error('Download error:', error);
            if (error.response && error.response.status === 404) {
                toast.error("Resume not uploaded by applicant");
            } else {
                toast.error("Failed to download resume");
            }
        } finally {
            removeFromProcessing(processingKey);
        }
    };

    // Sorting
    const sortApplications = (apps: ApplicationWithUserAndJob[]) => {
        return [...apps].sort((a, b) => {
            let aValue: any = a[sortField as keyof ApplicationWithUserAndJob];
            let bValue: any = b[sortField as keyof ApplicationWithUserAndJob];

            if (sortField === 'appliedDate') {
                aValue = new Date(a.appliedDate || 0).getTime();
                bValue = new Date(b.appliedDate || 0).getTime();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    };

    // Filtering
    const filterApplications = (apps: ApplicationWithUserAndJob[]) => {
        let filtered = apps;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.userName?.toLowerCase().includes(lowerTerm) ||
                app.email?.toLowerCase().includes(lowerTerm) ||
                app.currentPosition?.toLowerCase().includes(lowerTerm)
            );
        }
        return filtered;
    };

    const filteredAndSortedApplications = sortApplications(filterApplications(applications));

    const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedApplications = filteredAndSortedApplications.slice(startIndex, endIndex);

    // Status Badge Helper
    const getStatusBadgeVariant = (status: string) => {
        const lowerStatus = status?.toLowerCase() || '';
        if (lowerStatus.includes('hired')) return 'default'; // Greenish usually
        if (lowerStatus.includes('rejected')) return 'destructive';
        if (lowerStatus.includes('interview')) return 'outline';
        if (lowerStatus.includes('shortlisted') || lowerStatus.includes('next_round')) return 'secondary';
        return 'secondary';
    };

    // Action Buttons Renderer
    const renderActionButtons = (app: ApplicationWithUserAndJob) => {
        const loading = isProcessing(app.id);
        const status = app.status || 'APPLIED';

        switch (status) {
            case 'APPLIED':
                return (
                    <div className="flex gap-2 justify-end">
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleShortlist(app.id)}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Shortlist'}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(app.id)}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Reject'}
                        </Button>
                    </div>
                );
            case 'SHORTLISTED':
                return (
                    <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleRequestNextRound(app.id)}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Request Next Round'}
                    </Button>
                );
            case 'NEXT_ROUND_ACCEPTED':
                return (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleScheduleInterview(app.id)}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Schedule Interview'}
                    </Button>
                );
            case 'INTERVIEW_SCHEDULED':
                return (
                    <span className="text-xs text-gray-400 font-medium opacity-50 cursor-not-allowed">
                        Waiting for Candidate Response
                    </span>
                );
            case 'INTERVIEW_ACCEPTED': // Status 5
                return (
                    <div className="flex gap-2 justify-end">
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleHire(app.id)}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Hire'}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(app.id)}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Reject'}
                        </Button>
                    </div>
                );
            case 'HIRED':
            case 'REJECTED':
            case 'NEXT_ROUND_REJECTED':
            case 'NEXT_ROUND_REQUESTED': // Waiting for user
            default:
                return (
                    <span className="text-xs text-gray-400 font-medium opacity-50 cursor-not-allowed">
                        {status === 'NEXT_ROUND_REQUESTED' ? 'Waiting for Candidate' : 'No Actions'}
                    </span>
                );
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading Applicants...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard?tab=posted-jobs')} className="p-0 hover:bg-transparent">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Applicants for {selectedJob?.title}
                    </h1>
                    <p className="text-gray-500">Manage and review candidates</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by name, email, or position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-3">Candidate</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3">Experience</th>
                                    <th className="px-6 py-3">Current Position</th>
                                    <th className="px-6 py-3">Applied Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paginatedApplications.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No applicants found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedApplications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={app.userProfilePicture} />
                                                        <AvatarFallback>{app.userName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium text-gray-900">{app.userName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {app.email}
                                                    </div>
                                                    {/* <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" /> {app.phone}
                                                    </div> */}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {app.experienceYears ? `${app.experienceYears} Years` : '0-1'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Briefcase className="h-3 w-3" />
                                                    {app.currentPosition || 'Not Specified'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusBadgeVariant(app.status || 'applied')}>
                                                    {app.status || 'APPLIED'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 relative">
                                                <div className="flex items-center justify-end min-h-[2rem]">
                                                    {/* Dynamic Actions */}
                                                    <div className="mr-24 flex items-center gap-2">
                                                        {renderActionButtons(app)}
                                                    </div>

                                                    {/* Fixed Icons - Absolutely positioned */}
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white pl-2">
                                                        {/* View Resume Button - Keeps slot even if empty for consistent alignment if preferred, or just conditional */}
                                                        <div className="w-8 h-8 flex items-center justify-center">
                                                            {app.userId && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => handleDownloadResume(app.userId, app.userName || 'Applicant')}
                                                                    disabled={isProcessing(`download-${app.userId}`)}
                                                                    title="Download Resume"
                                                                >
                                                                    {isProcessing(`download-${app.userId}`) ? (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                                    ) : (
                                                                        <Download className="h-4 w-4 text-blue-600" />
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {/* View Details Button */}
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewApplication(app)} title="View Details">
                                                            <Eye className="h-4 w-4 text-gray-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 border rounded-lg">
                    <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                </div>
            )}
        </div>
    );
};

export default JobApplicationsPage;
