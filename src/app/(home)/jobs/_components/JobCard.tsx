import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, Bookmark, MoreHorizontal, Flag, EyeOff, Ban, AlertTriangle } from "lucide-react";
import { Job, Institution } from '@/lib/api/types';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';
import { generateSlug } from '@/lib/utils/slug';

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
    const slug = generateSlug(job);
    router.push(`/find-jobs/${slug}`);
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

  const buildJobImageUrl = (raw?: string | null): string | null => {
    if (!raw) return null;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/')) return raw;
    return `https://${raw}`;
  };

  const instituteImageUrl = buildJobImageUrl((job.institution as any)?.profile_picture);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-[24px] p-6 mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-300 border border-gray-100/50 group"
    >
      <div className="flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {/* Company Logo */}
            <div className="w-[56px] h-[56px] rounded-[14px] overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 bg-white flex items-center justify-center p-1.5">
              {instituteImageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={instituteImageUrl}
                    alt={job.institution?.name || 'Institute'}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className={cn(
                  "w-full h-full rounded-[10px] flex items-center justify-center",
                  getCompanyColor(job.institution?.name || job.title)
                )}>
                  <span className="text-white font-bold text-xl">
                    {getCompanyInitial(job.institution?.name || job.title)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-0.5 min-w-0 pt-0.5">
              <h3 className="text-[20px] font-bold text-[#111827] leading-tight group-hover:text-blue-600 transition-colors truncate">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-[15px] font-normal text-gray-500">
                <span className="truncate">{job.institution?.name || "Healthcare Institute"}</span>
                <span className="text-gray-400">·</span>
                <span className="whitespace-nowrap">Posted {formatTimeAgo(job.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleBookmarkClick}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                isSaved ? "text-gray-400" : "text-gray-300 hover:text-gray-500 hover:bg-gray-50"
              )}
            >
              <Bookmark className="h-[26px] w-[26px]" fill={isSaved ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleMoreClick}
              className="p-2 rounded-xl text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-all duration-200"
            >
              {/* <MoreHorizontal className="h-[26px] w-[26px]" strokeWidth={2} /> */}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="text-[15px] leading-[1.6] text-gray-500 line-clamp-2">
          {job.shortDescription || ""}
        </div>

        {/* Footer Tags & Salary */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <div className="bg-[#F3F4F6] px-4 py-2 rounded-full text-[14px] font-medium text-gray-600">
            {job.experienceLevel || '3y+'}
          </div>
          <div className="bg-[#F3F4F6] px-4 py-2 rounded-full text-[14px] font-medium text-gray-600">
            {job.jobType || 'Full time'}
          </div>
          <div className="bg-[#F3F4F6] px-4 py-2 rounded-full text-[14px] font-medium text-gray-600">
            {(() => {
              const workLoc = job.workLocation || "On-site";
              const isHybridOrOnsite = ["hybrid", "onsite", "on-site"].includes(workLoc.toLowerCase());

              if (isHybridOrOnsite && (job.city || job.country)) {
                return `${workLoc} • ${[job.city, job.country].filter(Boolean).join(", ")}`;
              }
              return job.workLocation || (job.city && job.country ? `${job.city} / ${job.country.substring(0, 2).toUpperCase()}` : 'Onsite / LA');
            })()}
          </div>


          <div className="flex items-baseline gap-1.5 ml-auto sm:ml-4">
            <span className="text-[18px] font-bold text-[#111827]">
              {job.salaryMin && job.salaryMax ?
                `${job.salaryCurrency === 'INR' ? '₹' : '$'}${Math.round(job.salaryMin / 1000)}k-${Math.round(job.salaryMax / 1000)}k` :
                '$10k-13k'
              }
            </span>
            <span className="text-[14px] font-normal text-gray-400">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
