"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import JobPostingForm from '../_components/JobPostingFormStepWise';

const PostJobPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Post a Job</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6">
        <JobPostingForm />
      </div>
    </div>
  );
};

export default PostJobPage;
