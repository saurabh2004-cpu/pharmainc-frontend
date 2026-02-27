"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Download,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    Building2,
    User,
    Clock,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserAvatar } from '@/components/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { getApplicationById } from '@/lib/api/services/application';
import { downloadResume } from '@/lib/api/services/user';
import { initiateConversation } from '@/lib/api/services/messages'; // Import initiateConversation
import { getAuthToken } from '@/lib/api/utils';

interface ApplicationDetails {
    id: string;
    user: {
        id: string;
        name: string;
        firstName?: string;
        lastName?: string;
        email: string;
        phone: string;
        profile_picture?: string;
        role?: string;
        location?: string;
        specialization?: string;
        headline?: string;
        gender?: string;
        verified?: boolean;
        about?: string;
    };
    job: {
        id: string;
        title: string;
        institute?: {
            name: string;
        };
        location?: string;
        workLocation?: string;
        jobType?: string;
        experience_level?: string;
        experienceLevel?: string;
        salaryMin?: number;
        salaryMax?: number;
        salaryCurrency?: string;
        contactPerson?: string;
        contactEmail?: string;
        contactPhone?: string;
        applicationDeadline?: string;
        shortDescription?: string;
        additionalInfo?: string;
    };
    status: string;
    applied_at: string;
    appliedDate?: string; // Fallback
    created_at?: string; // Fallback
    reviewed_at?: string;
    responded_at?: string;
    notes?: string;
    resume_url?: string;
    resumeUrl?: string;
    cover_letter?: string;
    coverLetter?: string;
    portfolio_url?: string;
    // Dynamic additional fields
    experienceYears?: number;
    currentPosition?: string;
    currentInstitute?: string;
    additional_info?: Record<string, any>;
    additionalDetails?: Record<string, any>;
}

const ApplicationDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const applicationId = params.applicationId as string;

    const [application, setApplication] = useState<ApplicationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingResume, setDownloadingResume] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initiatingChat, setInitiatingChat] = useState(false);

    useEffect(() => {
        // Check auth
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }
        setIsAuthenticated(true);

        if (!applicationId) {
            toast.error('Invalid application ID');
            router.back();
            return;
        }

        fetchApplicationDetails();
    }, [applicationId, router]);

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);
            const data = await getApplicationById(applicationId);
            setApplication(data);
        } catch (error: any) {
            console.error('Error fetching application details:', error);
            if (error?.response?.status === 404) {
                setApplication(null);
            } else {
                toast.error('Failed to load application details');
            }
        } finally {
            setLoading(false);
        }
    };

    // const handleDownloadResume = async () => {
    //     if (!application?.user?.id) return;

    //     setDownloadingResume(true);
    //     try {
    //         const blob = await downloadResume(application.user.id);

    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;

    //         const type = blob.type;
    //         let extension = 'pdf';
    //         if (type === 'application/msword') extension = 'doc';
    //         if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') extension = 'docx';

    //         const userName = application.user.firstName
    //             ? `${application.user.firstName}_${application.user.lastName || ''}`
    //             : application.user.name || 'Applicant';

    //         link.setAttribute('download', `${userName.replace(/\s+/g, '_')}_Resume.${extension}`);
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //         window.URL.revokeObjectURL(url);

    //         toast.success('Resume downloaded successfully');
    //     } catch (error: any) {
    //         console.error('Download error:', error);
    //         if (error?.response?.status === 404) {
    //             toast.error('Resume not uploaded by applicant');
    //         } else {
    //             toast.error('Failed to download resume');
    //         }
    //     } finally {
    //         setDownloadingResume(false);
    //     }
    // };


    const handleDownloadResume = async (resumeUrl) => {
        window.open(resumeUrl, '_blank');
    }

    const handleMessageCandidate = async () => {
        if (!application) return;

        setInitiatingChat(true);
        try {
            await initiateConversation(applicationId);
            toast.success('Conversation started');
            router.push(`/messages?user=${application.user.id}`); // Redirect to messages page
        } catch (error: any) {
            console.error('Error initiating conversation:', error);
            toast.error(error.response?.data?.error || 'Failed to start conversation');
        } finally {
            setInitiatingChat(false);
        }
    };

    const getStatusConfig = (status: string) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'APPLIED':
                return { label: 'Applied', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' };
            case 'NEXT_ROUND_REQUESTED':
                return { label: 'Next Round Requested', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' };
            case 'NEXT_ROUND_ACCEPTED':
                return { label: 'Next Round Accepted', className: 'bg-green-100 text-green-800 hover:bg-green-100' };
            case 'NEXT_ROUND_REJECTED':
                return { label: 'Next Round Rejected', className: 'bg-red-100 text-red-800 hover:bg-red-100' };
            case 'INTERVIEW_SCHEDULED':
                return { label: 'Interview Scheduled', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' };
            case 'INTERVIEW_ACCEPTED':
                return { label: 'Interview Accepted', className: 'bg-green-100 text-green-800 hover:bg-green-100' };
            case 'REJECTED':
                return { label: 'Rejected', className: 'bg-red-100 text-red-800 hover:bg-red-100' };
            case 'HIRED':
                return { label: 'Hired', className: 'bg-green-600 text-white hover:bg-green-700' };
            case 'SHORTLISTED':
                return { label: 'Shortlisted', className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' };
            default:
                return { label: status?.replace(/_/g, ' ') || 'Unknown', className: 'bg-gray-100 text-gray-800' };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <Skeleton className="h-10 w-32 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-80 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="p-4 rounded-full bg-gray-100 mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Application Not Found</h2>
                <p className="text-gray-500 mt-2 mb-6">We couldn't find the application details you're looking for.</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        );
    }

    const { user, job } = application;
    const statusConfig = getStatusConfig(application.status);
    const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.name;

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Badge variant="outline" className={`${statusConfig.className} text-sm px-3 py-1`}>
                    {statusConfig.label}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: User Profile */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <UserAvatar name={displayName} className="h-20 w-20" />
                                <div className="flex-1">
                                    <CardTitle className="text-2xl mb-2">{displayName}</CardTitle>
                                    <CardDescription className="text-base">
                                        {user.role || 'Job Seeker'}
                                    </CardDescription>
                                    {user.specialization && (
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Briefcase className="h-4 w-4" />
                                            <span>{user.specialization}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {user.headline && (
                                <p className="text-sm text-gray-700 italic mb-4">"{user.headline}"</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {user.phone}
                                </div>
                                {user.location && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {user.location}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button onClick={() => handleDownloadResume(application.resumeUrl)} disabled={downloadingResume}>
                                    {downloadingResume ? 'Downloading...' : 'Download Resume'}
                                </Button>
                                <Button variant="outline" onClick={handleMessageCandidate} disabled={initiatingChat}>
                                    {initiatingChat ? 'Starting Chat...' : 'Message Candidate'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Specifics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Applied For</dt>
                                    <dd className="text-sm font-semibold mt-1">{job.title}</dd>
                                    <dd className="text-xs text-gray-500">{job.institute?.name}</dd>
                                </div>
                                {application.experienceYears !== undefined && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Experience</dt>
                                        <dd className="text-sm mt-1">{application.experienceYears} Years</dd>
                                    </div>
                                )}
                                {application.currentPosition && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Current Position</dt>
                                        <dd className="text-sm mt-1">{application.currentPosition}</dd>
                                    </div>
                                )}
                                {(application.cover_letter || application.coverLetter) && (
                                    <div className="col-span-1 md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500 mb-2">Cover Letter</dt>
                                        <dd className="text-sm bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                                            {application.cover_letter || application.coverLetter}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Timeline & Documents */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">Applied on</span>
                                <span className="text-sm font-medium">
                                    {formatDate(application.applied_at || application.appliedDate || application.created_at || '')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* /* online resume - commented code */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Documents
                            </CardTitle>
                        </CardHeader>
                                {
                    {/* <CardContent className="space-y-3">
                            {(application.resume_url || application.resumeUrl) ? (
                                <Button variant="outline" className="w-full justify-start text-blue-600" onClick={() => window.open(application.resume_url || application.resumeUrl, '_blank')}>
                                    View Resume Online
                                </Button>
                            ) : (
                                <div className="text-sm text-gray-400">No documents preview available</div>
                            )}
                        </CardContent> */}
                    {/* </Card> */}
                </div>

            </div>
        </div>
    );
};

export default ApplicationDetailsPage;
