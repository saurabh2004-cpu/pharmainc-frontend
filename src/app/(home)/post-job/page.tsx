"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import JobPostingForm from '../jobs/_components/JobPostingForm';

const PostJobPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Post a Job</h1>
          </div>
        </div>
      </div>
      
      <JobPostingForm />
    </div>
  );
};

export default PostJobPage;
