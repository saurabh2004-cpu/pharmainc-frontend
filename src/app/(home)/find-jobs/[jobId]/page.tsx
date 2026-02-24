"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, MapPin, Building2, Clock, DollarSign, Users, Briefcase, Calendar, Globe, CheckCircle, Share, Bookmark, TrendingUp, Target, Award, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobStore, useUserStore } from '@/store';
import { Job, Institution } from '@/lib/api/types';
import JobApplicationModal from './_components/JobApplicationModal';
import JobShareModal from '../_components/JobShareModal';
import InstituteProfileModal from './_components/InstituteProfileModal';
import ProfileIncompleteModal from './_components/ProfileIncompleteModal';
import { useEntity } from '@/hooks/useEntity';
import { checkProfileCompletion } from '@/lib/api/services/user';
import { toast } from 'sonner';
import { buildImageUrl } from '@/utils/buildImageUrl';





// Generate job stats
const generateJobStats = () => ({
  totalApplicants: Math.floor(Math.random() * 200) + 50,
  viewsCount: Math.floor(Math.random() * 1000) + 100,
  avgResponseTime: Math.floor(Math.random() * 7) + 1,
  hiringRate: Math.floor(Math.random() * 20) + 15,
});

// Extract skills from job description
const extractSkills = (description: string) => {
  const commonSkills = [
    'English', 'Communication', 'Sales', 'Business Development',
    'Customer Service', 'Healthcare', 'Medical Knowledge', 'Patient Care',
    'Treatment Planning', 'Consultation', 'Clinical Skills', 'Leadership'
  ];

  return commonSkills.filter(skill =>
    description.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 6);
};

// Simple masking functions
const maskPhoneNumber = (phone: string) => {
  if (!phone) return phone;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 4) return phone;

  const lastFour = cleaned.slice(-4);
  const maskedPart = 'x'.repeat(cleaned.length - 4);

  return maskedPart + lastFour;
};

const maskEmail = (email: string) => {
  if (!email) return email;
  const parts = email.split('@');
  if (parts.length !== 2) return email;

  const [localPart, domain] = parts;
  if (localPart.length <= 1) return email;

  const visibleStart = localPart.slice(0, 1);
  const maskedPart = 'x'.repeat(Math.min(localPart.length - 1, 8));

  return `${visibleStart}${maskedPart}@${domain}`;
};

const JobDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const { fetchSingleJob } = useJobStore();
  const { hasAppliedToJob, currentUser, isJobSaved, toggleSavedJob, fetchUserApplications } = useUserStore();
  const { isUser } = useEntity();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [showProfileIncompleteModal, setShowProfileIncompleteModal] = useState(false);
  const [profileErrorMessage, setProfileErrorMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const isBookmarked = isJobSaved(jobId);

  const [matchingScore, setMatchingScore] = useState<number | null>(null);
  const [jobStats, setJobStats] = useState<any>(null);
  const [jobSkills, setJobSkills] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const hasAlreadyApplied = hasAppliedToJob(jobId);

  const handleBookmark = async () => {
    if (!currentUser) {
      router.push('/login'); // Or show toast
      return;
    }
    await toggleSavedJob(jobId);
  };

  useEffect(() => {
    // Generate random stats only on client side to avoid hydration mismatch
    setJobStats(generateJobStats());
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (currentUser?.id) {
      fetchUserApplications(currentUser.id);
    }
  }, [currentUser?.id, fetchUserApplications]);

  useEffect(() => {
    const loadJob = async () => {
      if (jobId) {
        setLoading(true);
        try {
          const result = await fetchSingleJob(jobId);
          if (result) {
            setJob(result.job);
            setMatchingScore(result.matchingScore);
            setJobSkills(extractSkills(result.job.description || ''));
          } else {
            setJob(null);
          }
        } catch (error) {
          console.error('Error loading job:', error);
        }
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId, fetchSingleJob]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = async () => {
    // Prevent duplicate clicks
    if (isApplying) return;

    setIsApplying(true);

    try {
      const result = await checkProfileCompletion();

      if (result.isComplete) {
        // Profile is complete - proceed with application
        setShowApplicationModal(true);
      }
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 400) {
        // Profile incomplete - show modal with backend error message
        const errorMsg = error.response?.data?.error ||
          'Profile incomplete. Please complete your education, skills, and speciality before applying.';
        setProfileErrorMessage(errorMsg);
        setShowProfileIncompleteModal(true);
      } else if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        toast.error('Please login to apply for jobs');
        router.push('/login');
      } else {
        // Other errors (network, 500, etc.)
        console.error('Error checking profile completion:', error);
        toast.error('Failed to check profile status. Please try again.');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleViewInstituteProfile = () => {
    if (isUser && job?.instituteId) {
      setShowInstituteModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-6">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="font-semibold">Job Not Found</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const benefits = job.benefits ? (typeof job.benefits === 'string' ? job.benefits.split(', ') : []) : [];
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">{job.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isMounted && (!currentUser || currentUser.role !== 'INSTITUTE') && (
            <>
              <button
                onClick={handleBookmark}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} />
              </button>

              {!currentUser ? (
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6"
                >
                  Login to Apply
                </Button>
              ) : (
                hasAlreadyApplied ? (
                  <Button
                    disabled
                    className="bg-green-500 text-white font-medium px-6 cursor-not-allowed opacity-80"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    APPLIED
                  </Button>
                ) : (
                  <Button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 disabled:opacity-60"
                  >
                    {isApplying ? 'Checking...' : 'APPLY NOW →'}
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs - Simplified with only Overview and Share */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side - Navigation Tabs */}
            <div className="flex gap-8">
              <button className="py-2 border-b-2 border-black font-medium text-black">
                Overview
              </button>
            </div>

            {/* Right side - Share Button */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <Share className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-6">
              {/* Institute logo: image if available, else black square with initials */}
              {buildImageUrl((job.institute as any)?.profile_picture ?? undefined, '') ? (
                <div
                  onClick={handleViewInstituteProfile}
                  className={`w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-200 ${isUser ? 'cursor-pointer hover:ring-4 hover:ring-blue-200 transition-all duration-200' : ''}`}
                  title={isUser ? 'Click to view institute profile' : ''}
                >
                  <Image
                    src={buildImageUrl((job.institute as any)?.profile_picture)}
                    alt={job.institute?.name || 'Institute'}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div
                  onClick={handleViewInstituteProfile}
                  className={`w-20 h-20 bg-black rounded-2xl flex items-center justify-center flex-shrink-0 ${isUser ? 'cursor-pointer hover:ring-4 hover:ring-blue-200 transition-all duration-200' : ''}`}
                  title={isUser ? 'Click to view institute profile' : ''}
                >
                  <span className="text-white text-2xl font-bold">
                    {job.institute?.name ? getInitials(job.institute.name) : getInitials(job.title)}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    onClick={handleViewInstituteProfile}
                    className={`text-lg font-semibold text-gray-900 ${isUser ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''
                      }`}
                    title={isUser ? 'Click to view institute profile' : ''}
                  >
                    {job.institute?.name || "Company"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{formatTimeAgo(job.created_at)}</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap gap-6 text-gray-600 mb-4">
                  {(job.institute?.location) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{job.institute?.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">
                      {/* {job.workLocation} */}
                      {(job.workLocation?.toLowerCase() === 'on-site' || job.workLocation?.toLowerCase() === 'onsite') && (job.city || job.country) && (
                        <span>  {[job.city, job.country].filter(Boolean).join(', ')}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{job.experienceLevel}</span>
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        {job.salaryCurrency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Resume Button */}
            {/* <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 flex items-center justify-between border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">P</span>
                </div>
                <span className="font-medium text-gray-800">Maximize your interview chances</span>
              </div>
              <Button
                variant="secondary"
                className="bg-white hover:bg-gray-50 text-gray-800 font-medium px-4 py-2 rounded-lg border shadow-sm"
              >
                ⚡ Generate Custom Resume
              </Button>
            </div> */}

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">{job.jobType}</Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">{job.experienceLevel}</Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">{job.workLocation}</Badge>
              {job.specialties && job.specialties.length > 0 && job.specialties.map((specialty: any, index: number) => (
                <Badge key={index} variant="outline" className="border-purple-300 text-purple-700 bg-purple-50 px-3 py-1">
                  {typeof specialty === 'object' && specialty !== null ? (specialty.name || specialty.id) : specialty}
                </Badge>
              ))}
              {(job.experienceLevel && job.experienceLevel !== 'Entry Level') && (
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Work Exp Needed
                </Badge>
              )}
            </div>

            {job.shortDescription && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-gray-800 leading-relaxed font-medium break-words max-w-full overflow-wrap-anywhere">
                    {job.shortDescription}
                  </p>
                </CardContent>
              </Card>
            )}

            {job.fullDescription && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-gray-800 leading-relaxed font-medium break-words max-w-full overflow-wrap-anywhere">
                    {job.fullDescription}
                  </p>
                </CardContent>
              </Card>
            )}

            {job.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-w-full overflow-hidden">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-w-full overflow-hidden">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                      {job.requirements}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Job Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-full overflow-hidden">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-600 font-medium flex-shrink-0">Job Type</span>
                    <span className="font-semibold text-gray-900 text-right break-words">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-600 font-medium flex-shrink-0">Experience Level</span>
                    <span className="font-semibold text-gray-900 text-right break-words">{job.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-600 font-medium flex-shrink-0">Work Location</span>
                    <span className="font-semibold text-gray-900 text-right break-words">
                      {job.workLocation}
                      {(job.workLocation?.toLowerCase() === 'on-site' || job.workLocation?.toLowerCase() === 'onsite') && (job.city || job.country) && (
                        <span className="text-gray-500 font-medium"> • {[job.city, job.country].filter(Boolean).join(', ')}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-600 font-medium flex-shrink-0">Salary Range</span>
                    <span className="font-semibold text-gray-900 text-right break-words">
                      {job.salaryMin && job.salaryMax ?
                        `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}` :
                        'Not specified'
                      }
                    </span>
                  </div>
                  {job.applicationDeadline && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 gap-4">
                      <span className="text-gray-600 font-medium flex-shrink-0">Application Deadline</span>
                      <span className="font-semibold text-red-600 text-right break-words">{formatDate(job.applicationDeadline)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 gap-4">
                    <span className="text-gray-600 font-medium flex-shrink-0">Status</span>
                    <span className="font-semibold text-green-600 capitalize text-right break-words">{job.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {job.additionalInfo && job.additionalInfo !== 'Not Applicable' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words max-w-full overflow-wrap-anywhere">
                    {job.additionalInfo}
                  </p>
                </CardContent>
              </Card>
            )}

          </div>


          <div className="space-y-6">

            {/* match data */}
            {/* matching score */}
            {(matchingScore !== null && matchingScore !== undefined) && (
              <Card className="text-center border-2 bg-white shadow-sm">
                <CardContent className="pt-8 pb-6">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-100 flex items-center justify-center relative bg-white">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(from 0deg, #10B981 0deg ${matchingScore * 3.6}deg, #E5E7EB ${matchingScore * 3.6}deg 360deg)`
                        }}
                      ></div>
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10 shadow-inner">
                        <span className="text-3xl font-bold text-gray-900">{Math.round(matchingScore)}%</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="text-lg font-bold mb-2"
                    style={{
                      color: matchingScore >= 80 ? '#059669' :
                        matchingScore >= 65 ? '#0891b2' :
                          matchingScore >= 50 ? '#ea580c' : '#dc2626'
                    }}
                  >
                    {matchingScore >= 80 ? "EXCELLENT MATCH" :
                      matchingScore >= 65 ? "GOOD MATCH" :
                        matchingScore >= 50 ? "FAIR MATCH" : "POOR MATCH"}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Matching Score</div>

                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.contactPerson && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Contact Person</div>
                    <div className="font-semibold text-gray-900">{job.contactPerson}</div>
                  </div>
                )}
                {job.contactEmail && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Email</div>
                    <div className="text-sm text-gray-700">{maskEmail(job.contactEmail)}</div>
                  </div>
                )}
                {job.contactPhone && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Phone</div>
                    <div className="text-sm text-gray-700">{maskPhoneNumber(job.contactPhone)}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {job.institute && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    About the Company
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-w-full overflow-hidden">
                  <div>
                    <h4
                      onClick={handleViewInstituteProfile}
                      className={`font-semibold text-gray-900 mb-1 flex items-center gap-2 flex-wrap ${isUser ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
                      title={isUser ? 'Click to view institute profile' : ''}
                    >
                      <span className="break-words">{job.institute?.name}</span>
                      {(job.institute?.verified) && (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 break-words">
                      {job.institute?.role}
                    </p>
                    {(job.institute?.about) && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-3 break-words overflow-wrap-anywhere">
                        {job.institute?.about}
                      </p>
                    )}
                    {job.institute?.headline && (
                      <p className="text-sm text-gray-600 italic break-words overflow-wrap-anywhere">
                        {job.institute.headline}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    {(job.institute?.location) && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="break-words">{job.institute?.location}</span>
                      </div>
                    )}
                    {(job.institute?.contactEmail) && (
                      <div className="flex items-start gap-2">
                        <Globe size={14} className="text-gray-400 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-700 break-words">
                          {maskEmail(job.institute?.contactEmail || '')}
                        </span>
                      </div>
                    )}
                    {(job.institute?.contactNumber) && (
                      <div className="flex items-start gap-2">
                        <Clock size={14} className="text-gray-400 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-700 break-words">
                          {maskPhoneNumber(job.institute?.contactNumber || '')}
                        </span>
                      </div>
                    )}
                    {job.institute?.yearEstablished && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>Established {job.institute.yearEstablished}</span>
                      </div>
                    )}
                    {job.institute?.ownership && (
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-gray-400" />
                        <span>{job.institute.ownership}</span>
                      </div>
                    )}
                    {job.institute?.affiliatedUniversity && (
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-gray-400" />
                        <span>Affiliated: {job.institute.affiliatedUniversity}</span>
                      </div>
                    )}
                  </div>

                  {job.institute?.specialties && job.institute.specialties.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-2">
                        {job.institute.specialties.map((specialty: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {typeof specialty === 'object' && specialty !== null ? (specialty.name || specialty.id) : specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Benefits & Perks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-w-full overflow-hidden">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 break-words flex-1">{benefit.trim()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {job && (
        <>
          <JobApplicationModal
            isOpen={showApplicationModal}
            onClose={() => setShowApplicationModal(false)}
            job={job}
          />
          <JobShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            job={job}
          />
          {isUser && job.instituteId && (
            <InstituteProfileModal
              isOpen={showInstituteModal}
              onClose={() => setShowInstituteModal(false)}
              instituteId={job.instituteId}
            />
          )}
          {currentUser && (
            <ProfileIncompleteModal
              isOpen={showProfileIncompleteModal}
              onClose={() => setShowProfileIncompleteModal(false)}
              errorMessage={profileErrorMessage}
              userId={currentUser?.id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default JobDetailPage;
