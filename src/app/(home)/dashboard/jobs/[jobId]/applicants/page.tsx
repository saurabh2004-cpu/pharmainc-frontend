'use client'
import { useRouter, useParams } from 'next/navigation';
import { getUserType } from '@/lib/api/utils';
import { useInstitutionStore } from '@/store';
import { getJob as fetchJob, getJobInstitute } from '@/lib/api/services/job';
import {
    getApplicationsByJob,
    requestNextRound,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Application, Job } from '@/lib/api/types';
import {
    Search, Filter, Download, Eye, FileText, ChevronUp, ChevronDown,
    ArrowLeft, Trash2, Mail, Phone, Clock, Briefcase,
    CheckCircle, XCircle, Calendar, UserCheck, X, MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import ScheduleInterviewModal from './_components/ScheduleInterviewModal';
import { useEffect, useState } from 'react';

interface ApplicationWithUserAndJob extends Application {
    userName?: string;
    email?: string;
    phone?: string;
    currentPosition?: string;
    experienceYears?: number | null;
    appliedDate?: string;
    userProfilePicture?: string;
}

const TAB_CONFIG = [
    {
        id: 'ALL',
        label: 'All candidates',
        filter: (status: string) => true
    },
    {
        id: 'APPLIED',
        label: 'Applied',
        filter: (status: string) => status === 'APPLIED'
    },
    {
        id: 'SHORTLISTED',
        label: 'Shortlisted',
        filter: (status: string) => ['SHORTLISTED', 'NEXT_ROUND_REQUESTED', 'NEXT_ROUND_ACCEPTED'].includes(status)
    },
    {
        id: 'INTERVIEW_SCHEDULED',
        label: 'Interview Scheduled',
        filter: (status: string) => status === 'INTERVIEW_SCHEDULED'
    },
    {
        id: 'INTERVIEW_ACCEPTED',
        label: 'Interview Accepted',
        filter: (status: string) => status === 'INTERVIEW_ACCEPTED'
    },
    {
        id: 'HIRED',
        label: 'Hired',
        filter: (status: string) => status === 'HIRED'
    },
    {
        id: 'REJECTED',
        label: 'Rejected',
        filter: (status: string) => ['REJECTED', 'NEXT_ROUND_REJECTED', 'INTERVIEW_REJECTED'].includes(status)
    },
];

const JobApplicationsPage = () => {
    const router = useRouter();
    const params = useParams();
    const jobId = params.jobId as string;
    const { currentInstitution } = useInstitutionStore();
    const [applications, setApplications] = useState<ApplicationWithUserAndJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
    const [sortField, setSortField] = useState<string>('appliedDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [processingIds, setProcessingIds] = useState<string[]>([]); // Track processing actions
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

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

    // Removed unused handleScheduleInterview function

    const handleScheduleInterviewClick = (appId: string) => {
        setSelectedApplicantId(appId);
        setShowScheduleModal(true);
    };

    const handleInterviewScheduled = () => {
        if (selectedApplicantId) {
            updateLocalStatus(selectedApplicantId, 'INTERVIEW_SCHEDULED');
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
    const getFilteredApplications = () => {
        let filtered = applications;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.userName?.toLowerCase().includes(lowerTerm) ||
                app.email?.toLowerCase().includes(lowerTerm) ||
                app.currentPosition?.toLowerCase().includes(lowerTerm)
            );
        }

        // Filter by Tab Status
        const activeTab = TAB_CONFIG.find(t => t.id === selectedTab);
        if (activeTab) {
            filtered = filtered.filter(app => activeTab.filter(app.status || 'APPLIED'));
        }

        return filtered;
    };

    const filteredAndSortedApplications = sortApplications(getFilteredApplications());

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
                        onClick={() => handleScheduleInterviewClick(app.id)}
                        disabled={loading}
                    >
                        Schedule Interview
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

            {/* Custom Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {TAB_CONFIG.map((tab) => {
                    const count = applications.filter(app => tab.filter(app.status || 'APPLIED')).length;
                    const isActive = selectedTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setSelectedTab(tab.id);
                                setCurrentPage(1);
                            }}
                            className={`
                                flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200
                                ${isActive
                                    ? 'border-green-600 bg-green-50 text-green-700 shadow-sm ring-1 ring-green-600'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50/50'
                                }
                            `}
                        >
                            <span className={`text-2xl font-bold mb-1 ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
                                {count}
                            </span>
                            <span className="text-sm font-medium">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
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
                                    {/* <th className="px-6 py-3">Applied Date</th> */}
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paginatedApplications.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No applicants found for <strong>{TAB_CONFIG.find(t => t.id === selectedTab)?.label}</strong>.
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
                                            {/* <td className="px-6 py-4 text-gray-500">
                                                {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '-'}
                                            </td> */}
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusBadgeVariant(app.status || 'applied')}>
                                                    {app.status || 'APPLIED'}
                                                </Badge>
                                            </td>
                                            <td className=" py-4 relative">
                                                <div className="flex items-center justify-end min-h-[2rem]">
                                                    {/* Dynamic Actions */}
                                                    <div className="mr-24 flex items-center gap-2">
                                                        {renderActionButtons(app)}
                                                    </div>

                                                    {/* Fixed Icons - Absolutely positioned */}
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white pl-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleViewApplication(app)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                {app.userId && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDownloadResume(app.userId, app.userName || 'Applicant')}
                                                                        disabled={isProcessing(`download-${app.userId}`)}
                                                                    >
                                                                        <Download className="mr-2 h-4 w-4" />
                                                                        Download Resume
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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

            <ScheduleInterviewModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                applicationId={selectedApplicantId}
                onSuccess={handleInterviewScheduled}
            />
        </div>
    );
};

export default JobApplicationsPage;
