"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Building2, Clock } from "lucide-react";
import { getUserType } from "@/lib/api/utils";
import { listJobs } from "@/lib/api/services/job";
import { Job, Institution } from "@/lib/api/types";
import { generateSlug } from "@/lib/utils/slug";

interface JobWithInstitution extends Job {
  institution?: Institution;
}

interface JobCardProps {
  job: JobWithInstitution;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();

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

  const handleCardClick = () => {
    router.push(`/find-jobs/${generateSlug(job)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="mb-3 pb-3 last:mb-0 last:pb-0 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
    >
      <h4 className="font-medium text-xs text-gray-900 mb-1 font-sans hover:text-blue-600 transition-colors">
        {job.title}
      </h4>
      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
        <Building2 size={12} />
        <span>{job.institution?.name || "Healthcare Institute"}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-1">
          <MapPin size={10} />
          <span>{job.workLocation || job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{formatTimeAgo(job.created_at)}</span>
        </div>
      </div>
      <div className="text-xs text-gray-600">
        {job.pay_range}
      </div>
    </div>
  );
};

export function RightSidebar() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobWithInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedJobs, setDisplayedJobs] = useState<JobWithInstitution[]>([]);
  const [isInstitute, setIsInstitute] = useState(false);

  useEffect(() => {
    const checkUserTypeAndFetchJobs = async () => {
      const currentUserType = getUserType();
      if (currentUserType && ["HOSPITAL", "CLINIC", "LAB", "PHARMACY"].includes(currentUserType)) {
        setIsInstitute(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await listJobs(1, 10, undefined, undefined, undefined, 'active'); // fetch 10 active jobs
        const allJobs = response.data;

        // Shuffle the jobs and take random 5
        const shuffledJobs = [...allJobs].sort(() => Math.random() - 0.5);
        const randomFive = shuffledJobs.slice(0, 5);

        setJobs(allJobs);
        setDisplayedJobs(randomFive);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserTypeAndFetchJobs();
  }, []);

  const handleShowMore = () => {
    router.push('/find-jobs');
  };

  if (isInstitute) {
    return null;
  }

  return (
    <aside
      className="w-80 flex-shrink-0 bg-white px-4 font-sans"
      style={{ position: "sticky", top: "0", alignSelf: "flex-start", height: "100vh", overflowY: "auto" }}
    >
      <div className="flex flex-col gap-4 pt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm text-gray-900 font-sans">Job Suggestions</h3>
            <button
              onClick={handleShowMore}
              className="text-xs text-blue-600 hover:underline font-sans"
            >
              See all
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : displayedJobs.length > 0 ? (
            <>
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              <button
                onClick={handleShowMore}
                className="w-full mt-3 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-md transition-colors font-sans"
              >
                Show More Jobs
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500 font-sans">No jobs available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
