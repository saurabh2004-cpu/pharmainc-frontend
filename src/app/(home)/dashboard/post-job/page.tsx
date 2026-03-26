"use client";

import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import JobPostingForm from '../_components/JobPostingFormStepWise';
import { useEffect, useState } from 'react';
import { checkInstituteVerificationStatus } from '@/lib/api/services/institute';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PostJobPage = () => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const result = await checkInstituteVerificationStatus();
        setIsVerified(result.verified);
      } catch (error) {
        console.error("Failed to check verification status:", error);
        toast.error("Failed to check verification status. Please try again.");
      } finally {
        setVerificationLoading(false);
      }
    };
    checkVerification();
  }, []);

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

      <div className="max-w-7xl mx-auto p-1 md:p-6">
        {verificationLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-dashed border-gray-300">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Checking verification status...</p>
          </div>
        ) : (
          <>
            {!isVerified && (
              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-900 leading-tight">Your institute is not verified.</h3>
                    <p className="text-sm text-orange-700">You must complete verification before creating jobs.</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/verification')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 shadow-sm whitespace-nowrap"
                >
                  Verify Institute
                </Button>
              </div>
            )}
            <JobPostingForm isVerified={isVerified === true} />
          </>
        )}
      </div>
    </div>
  );
};

export default PostJobPage;
