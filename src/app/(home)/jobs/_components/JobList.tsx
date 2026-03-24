"use client";

import React from "react";
import { useInView } from 'react-intersection-observer';
import JobCard from "./JobCard";
import { Job, Institution } from "@/lib/api/types";

interface JobWithInstitution extends Job {
  institution?: Institution;
}

interface JobListProps {
  jobs: JobWithInstitution[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  loading, 
  loadingMore, 
  hasMore,
  onLoadMore
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  React.useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loadingMore, onLoadMore]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50/50 animate-pulse">
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-[56px] h-[56px] bg-gray-100 rounded-[14px]"></div>
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="h-6 bg-gray-100 rounded w-48"></div>
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                  <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="flex gap-3">
                <div className="h-9 bg-gray-100 rounded-full w-20"></div>
                <div className="h-9 bg-gray-100 rounded-full w-24"></div>
                <div className="h-9 bg-gray-100 rounded-full w-28"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {jobs.length > 0 ? (
        <>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}
          
          {hasMore && (
            <div ref={ref} className="flex justify-center py-6">
              {loadingMore && (
                <div className="text-gray-500 font-medium animate-pulse">Loading more jobs...</div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-[24px] shadow-sm">
          <div className="text-gray-400 text-xl font-bold mb-2">No jobs found</div>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default JobList;
