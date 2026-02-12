import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, Bookmark, MoreHorizontal, Flag, EyeOff, Ban, AlertTriangle } from "lucide-react";
import { Job, Institution } from '@/lib/api/types';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

interface JobWithInstitution extends Job {
  institution?: Institution;
}

type JobCardProps = {
  job: JobWithInstitution;
};

const JobCard = ({ job }: JobCardProps) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { toggleSavedJob, isJobSaved, currentUser } = useUserStore();
  const isSaved = isJobSaved(job.id);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  const handleCardClick = () => {
    router.push(`/find-jobs/${job.id}`);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/find-jobs/${job.id}`);
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      // TODO: Redirect to login or show auth modal
      console.log('User not logged in');
      return;
    }
    await toggleSavedJob(job.id);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleReportJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    // TODO: Implement report job functionality
    console.log('Report job:', job.id);
  };

  const handleNotInterested = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    // TODO: Implement not interested functionality
    console.log('Not interested in job:', job.id);
  };

  const handleBlockCompany = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    // TODO: Implement block company functionality
    console.log('Block company:', job.institution?.name);
  };

  const handleMarkAsInappropriate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    // TODO: Implement mark as inappropriate functionality
    console.log('Mark as inappropriate:', job.id);
  };

  const getCompanyInitial = (companyName: string) => {
    return companyName.charAt(0).toUpperCase();
  };

  const getCompanyColor = (companyName: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    const index = companyName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className={cn(
          "w-12 h-12 rounded flex items-center justify-center flex-shrink-0",
          getCompanyColor(job.institution?.name || job.title)
        )}>
          <span className="text-white font-semibold text-lg">
            {getCompanyInitial(job.institution?.name || job.title)}
          </span>
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-blue-600 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm mb-1 truncate">
                {job.institution?.name || "Healthcare Institute"} • Posted {formatTimeAgo(job.created_at)}
              </p>
              <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                {job.description && job.description.length > 150
                  ? `${job.description.substring(0, 150)}...`
                  : job.description
                }
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3 min-w-0">
                <div className="flex items-center gap-1 truncate">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span className="truncate">
                    {(job.workLocation?.toLowerCase() === 'on-site' || job.workLocation?.toLowerCase() === 'onsite') && (job.city || job.country)
                      ? `${[job.city, job.country].filter(Boolean).join(', ')}`
                      : (job.workLocation || job.location)}
                  </span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <span className="truncate">{job.pay_range || (job.salaryMin && job.salaryMax ?
                    `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}` :
                    'Salary not specified')}</span>
                </div>
                <span className="text-gray-400">/month</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-300">
                  {job.jobType || job.work_location}
                </Badge>
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-300">
                  {job.role}
                </Badge>
                {job.status && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                    {job.status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={handleBookmarkClick}
                className={cn(
                  "p-2 rounded-full transition-colors hover:bg-gray-100",
                  isSaved ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
                )}
              >
                <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
              </button>
              {/* <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleMoreClick}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal size={16} />
                </button>

                {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                  <button
                    onClick={handleNotInterested}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <EyeOff size={16} className="text-gray-500" />
                    <span>Not interested</span>
                  </button>
                  {/* <button
                      onClick={handleBlockCompany}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Ban size={16} className="text-gray-500" />
                      <span>Block {job.institution?.name || 'company'}</span>
                    </button> */}
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleMarkAsInappropriate}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <AlertTriangle size={16} className="text-yellow-600" />
                    <span>Mark as inappropriate</span>
                  </button>
                  <button
                    onClick={handleReportJob}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <Flag size={16} className="text-red-600" />
                    <span>Report job</span>
                  </button>
                </div>
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
