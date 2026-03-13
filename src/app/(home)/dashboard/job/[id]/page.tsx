"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJob } from "@/lib/api/services/job";
import { Job } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, DollarSign, Briefcase, Mail, Phone, User, Building } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const JobDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                if (params.id) {
                    const data = await getJob(params.id as string);
                    setJob(data.job);
                }
            } catch (err) {
                console.error("Failed to fetch job details:", err);
                setError("Failed to load job details.");
                toast.error("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [params.id]);

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 space-y-6 max-w-5xl">
                <div className="flex items-center space-x-4 mb-6">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container mx-auto py-8 px-4 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-6">{error || "Job not found"}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:pl-2 transition-all"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                        {job.title}
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                                        <span className="flex items-center">
                                            <Briefcase className="mr-1 h-3 w-3" /> {job.role}
                                        </span>
                                        <span className="flex items-center">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {job.city && job.country ? `${job.city}, ${job.country}` : job.workLocation}
                                        </span>
                                        <span className="flex items-center">
                                            <Badge variant={job.status === "active" ? "default" : "secondary"}>
                                                {job.status}
                                            </Badge>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {job.skills && job.skills.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words"
                                    dangerouslySetInnerHTML={{ __html: job.shortDescription }}
                                />
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold mb-2">Full Description </h3>
                                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words"
                                    dangerouslySetInnerHTML={{ __html: job.fullDescription }}
                                />
                            </section>



                            <section>
                                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words"
                                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                                />
                            </section>

                            {job.additionalInfo && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words"
                                        dangerouslySetInnerHTML={{ __html: job.additionalInfo }}
                                    />
                                </section>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Job Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start">
                                <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Salary Range</p>
                                    <p className="text-sm text-gray-600">
                                        {job.salaryCurrency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Job Type</p>
                                    <p className="text-sm text-gray-600">{job.jobType}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Experience Level</p>
                                    <p className="text-sm text-gray-600">{job.experienceLevel}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Posted On</p>
                                    <p className="text-sm text-gray-600">{format(new Date(job.created_at), "PPP")}</p>
                                </div>
                            </div>

                            {job.applicationDeadline && (
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Deadline</p>
                                        <p className="text-sm text-gray-600">{format(new Date(job.applicationDeadline), "PPP")}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {job.contactPerson && (
                                <div className="flex items-center text-sm">
                                    <User className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-700">{job.contactPerson}</span>
                                </div>
                            )}
                            {job.contactEmail && (
                                <div className="flex items-center text-sm">
                                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                                    <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline">
                                        {job.contactEmail}
                                    </a>
                                </div>
                            )}
                            {job.contactPhone && (
                                <div className="flex items-center text-sm">
                                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-700">{job.contactPhone}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;
