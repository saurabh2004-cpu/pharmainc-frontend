"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import JobPostingForm from '../jobs/_components/JobPostingForm';
import { useEffect, useState } from 'react';
import { checkInstituteVerificationStatus } from '@/lib/api/services/institute';
import { InstituteVerificationModal } from '../dashboard/_components';
import { toast } from 'sonner';

const PostJobPage = () => {
  const router = useRouter();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const result = await checkInstituteVerificationStatus();
        if (!result.verified) {
          setShowVerificationModal(true);
        }
      } catch (error) {
        console.error("Failed to check verification status", error);
        toast.error("Failed to check verification status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

      <InstituteVerificationModal
        isOpen={showVerificationModal}
        onClose={() => router.push('/dashboard')}
      />
    </div>
  );
};

export default PostJobPage;
