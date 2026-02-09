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
      <div className="bg-white border border-gray-200 rounded-lg">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 last:border-b-0 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex gap-2 mb-3">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-14"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {jobs.length > 0 ? (
        <>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}
          
          {hasMore && (
            <div ref={ref} className="flex justify-center py-4 border-t border-gray-200">
              {loadingMore && (
                <div className="text-lg text-gray-600">Loading more jobs...</div>
              )}
            </div>
          )}
          
          {!hasMore && jobs.length > 0 && (
            <div className="flex justify-center py-4 border-t border-gray-200">
              <div className="text-lg text-gray-500">No more jobs to load</div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No jobs found</div>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default JobList;
