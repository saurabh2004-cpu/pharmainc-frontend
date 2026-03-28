import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, LayoutDashboard, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface JobPostSuccessProps {
  isEditMode?: boolean;
  onPostAnother?: () => void;
}

const JobPostSuccess: React.FC<JobPostSuccessProps> = ({ isEditMode = false, onPostAnother }) => {
  const router = useRouter();

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-none bg-transparent">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-[#169BA4]/10 rounded-full flex items-center justify-center mb-8 border-4 border-[#169BA4]/20">
          <CheckCircle className="w-12 h-12 text-[#169BA4]" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          {isEditMode ? "Job Updated Successfully" : "Job Posted Successfully"}
        </h2>
        
        <p className="text-gray-600 mb-12 max-w-md text-lg leading-relaxed">
          {isEditMode 
            ? "Your changes have been saved and the job posting has been updated."
            : "Your job has been posted successfully and is now visible to potential candidates."
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-12 px-8 border-gray-200 hover:bg-gray-50 text-gray-700 transition-all font-medium"
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => {
              if (onPostAnother) {
                onPostAnother();
              } else {
                router.push('/dashboard/post-job');
                window.location.reload(); // Ensure fresh state if already on that page
              }
            }}
            className="h-12 px-8 bg-[#233F64] hover:bg-[#169BA4] text-white transition-all font-medium shadow-lg hover:shadow-[#169BA4]/20"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {isEditMode ? "Post a New Job" : "Post Another Job"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPostSuccess;
