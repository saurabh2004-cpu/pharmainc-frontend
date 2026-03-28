"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, DollarSign, Upload, FileText, Briefcase, User, Mail, Loader2 } from "lucide-react";
import { Job, Institution } from '@/lib/api/types';

import { applyForJob } from '@/lib/api/services/job';
import { getCurrentOrganization } from '@/lib/api/services/userProfile';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

interface ApplicationFormData {
  coverLetter: string;
  experienceYears: string;
  currentPosition: string;
  currentInstitute: string;
  additionalDetails: string;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  job
}: JobApplicationModalProps) {
  const router = useRouter();
  const { currentUser, addApplication } = useUserStore();
  const [formData, setFormData] = useState<ApplicationFormData>({
    coverLetter: '',
    experienceYears: '',
    currentPosition: '',
    currentInstitute: '',
    additionalDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoadingOrgData, setIsLoadingOrgData] = useState(false);

  // Fetch current organization data when modal opens
  React.useEffect(() => {
    const fetchCurrentOrganization = async () => {
      if (isOpen && currentUser?.id && currentUser?.role !== 'STUDENT') {
        setIsLoadingOrgData(true);
        try {
          const orgData = await getCurrentOrganization();

          // Map numeric experience to range value
          const mapExperienceToRange = (years: number | undefined) => {
            if (years === undefined || years === null) return '';
            if (years >= 11) return '11';
            if (years >= 7) return '7';
            if (years >= 4) return '4';
            if (years >= 2) return '2';
            return '0';
          };

          const experienceValue = mapExperienceToRange(currentUser.experience);

          setFormData(prev => ({
            ...prev,
            currentPosition: orgData.role || '',
            currentInstitute: orgData.organizationName || '',
            experienceYears: experienceValue || prev.experienceYears
          }));
        } catch (error) {
          console.error('Failed to fetch current organization:', error);
        } finally {
          setIsLoadingOrgData(false);
        }
      }
    };

    if (isOpen) {
      fetchCurrentOrganization();
    } else {
      // Reset form when modal closes
      setFormData({
        coverLetter: '',
        experienceYears: '',
        currentPosition: '',
        currentInstitute: '',
        additionalDetails: ''
      });
      setResumeFile(null);
      setUploadProgress(0);
      setIsSubmitting(false);
    }
  }, [isOpen, currentUser?.id]);

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid File Type', {
          description: 'Please upload a PDF, DOC, or DOCX file'
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File Too Large', {
          description: 'File size must be less than 10MB'
        });
        return;
      }

      setResumeFile(file);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate user is logged in
      if (!currentUser?.id) {
        toast.error('Authentication Required', {
          description: 'You must be logged in to apply for jobs'
        });
        setIsSubmitting(false);
        return;
      }

      // Validate required fields
      if (!formData.coverLetter.trim()) {
        toast.error('Missing Information', {
          description: 'Please provide a cover letter'
        });
        setIsSubmitting(false);
        return;
      }
      if (currentUser.role !== 'STUDENT' && !formData.experienceYears) {
        toast.error('Missing Information', {
          description: 'Please specify your experience level'
        });
        setIsSubmitting(false);
        return;
      }
      if (!resumeFile) {
        toast.error('Missing Resume', {
          description: 'Please upload your resume'
        });
        setIsSubmitting(false);
        return;
      }

      const submissionData = new FormData();
      submissionData.append('jobId', job.id);
      submissionData.append('userId', currentUser.id); // Explicitly sending userId as requested, though usually auth token handles it.
      submissionData.append('coverLetter', formData.coverLetter);
      submissionData.append('experienceYears', formData.experienceYears);
      submissionData.append('currentPosition', formData.currentPosition || '');
      submissionData.append('currentInstitute', formData.currentInstitute || '');

      if (formData.additionalDetails) {
        // Backend expects JSON or string? "Accepts form data". 
        // Usually additional info is a string or JSON stringified. 
        // Previous code used object { notes: ... }. I'll send it as a JSON string to be safe or just the string if backend expects text.
        // Requirement says "Accepts form data". I'll append key-values.
        submissionData.append('additionalDetails', JSON.stringify({ notes: formData.additionalDetails }));
      }

      if (resumeFile) {
        submissionData.append('resume', resumeFile);
      }

      const submittedApplication = await applyForJob(submissionData);

      // Add application to store to update UI state immediately
      if (addApplication) {
        addApplication(submittedApplication);
      }

      toast.success('Application Submitted!', {
        description: 'Your application has been submitted successfully.'
      });

      onClose();

      setFormData({
        coverLetter: '',
        experienceYears: '',
        currentPosition: '',
        currentInstitute: '',
        additionalDetails: ''
      });
      setResumeFile(null);
      setUploadProgress(0);

    } catch (error: any) {
      console.error('Error submitting application:', error);

      const status = error?.response?.status;
      // Backend returns { error: "message" }
      const errorMessage = error?.response?.data?.error;
      const fallbackMessage = error?.message || 'Something went wrong. Please try again.';

      if (status === 400 && errorMessage && errorMessage.includes("Profile incomplete")) {
        toast.error('Profile Incomplete', {
          description: 'Please complete your profile (education, experience, skills, speciality) before applying.',
          duration: 5000,
        });
      } else if (status === 409) {
        toast.error('Already Applied', {
          description: 'You have already applied for this job.'
        });
      } else if (status === 404) {
        toast.error('Job Not Found', {
          description: 'Job not found.'
        });
      } else if (status === 401) {
        toast.error('Authentication Required', {
          description: 'Please login to apply for this job.'
        });
      } else {
        toast.error('Submission Failed', {
          description: errorMessage || fallbackMessage
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#233F64]" />
            Apply for Position
          </DialogTitle>
          <DialogDescription>
            Submit your application for {job.title} at {job.institute?.name || 'this organization'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Building2 size={14} />
              <span>{job.institute?.name || "Healthcare Institute"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign size={12} />
                <span>{job.pay_range}</span>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="space-y-4">
            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Cover Letter *
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position and how your experience makes you a great fit..."
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Experience Years */}
            {currentUser?.role !== 'STUDENT' && (
              <div className="space-y-2">
                <Label htmlFor="experienceYears" className="text-sm font-medium">
                  Years of Experience *
                </Label>
                <Select
                  value={formData.experienceYears}
                  onValueChange={(value) => handleInputChange('experienceYears', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Entry Level (0-1 years)</SelectItem>
                    <SelectItem value="2">Junior (2-3 years)</SelectItem>
                    <SelectItem value="4">Mid-Level (4-6 years)</SelectItem>
                    <SelectItem value="7">Senior (7-10 years)</SelectItem>
                    <SelectItem value="11">Expert (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Current Position & Institute */}
            {currentUser?.role !== 'STUDENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPosition" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Current Position
                  </Label>
                  <Input
                    id="currentPosition"
                    placeholder="e.g., Software Engineer, Doctor, etc."
                    value={formData.currentPosition}
                    onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                    disabled={isLoadingOrgData}
                  />
                  {isLoadingOrgData && (
                    <p className="text-xs text-gray-500">Loading your current position...</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentInstitute" className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Current Organization
                  </Label>
                  <Input
                    id="currentInstitute"
                    placeholder="e.g., ABC Hospital, XYZ Tech, etc."
                    value={formData.currentInstitute}
                    onChange={(e) => handleInputChange('currentInstitute', e.target.value)}
                    disabled={isLoadingOrgData}
                  />
                  {isLoadingOrgData && (
                    <p className="text-xs text-gray-500">Loading your current organization...</p>
                  )}
                </div>
              </div>
            )}

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resume/CV *
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="resume" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {resumeFile ? resumeFile.name : 'Upload your resume'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </span>
                    </label>
                    <input
                      id="resume"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={isSubmitting}
                    />
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Uploading... {Math.round(uploadProgress)}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <Label htmlFor="additionalDetails" className="text-sm font-medium">
                Additional Information
              </Label>
              <Textarea
                id="additionalDetails"
                placeholder="Any additional information you'd like to share (certifications, portfolio links, etc.)"
                value={formData.additionalDetails}
                onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-[#169BA4] hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-[#233F64] hover:bg-[#169BA4] disabled:opacity-80"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
