"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, FilePlus, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { getUserType } from "@/lib/api/utils";
import { JobPostingInterestModal } from "./JobPostingInterestModal";

const JobsLanding = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userType = getUserType();

  const handlePostJobClick = () => {
    // Check if user type is "institution" (from cookies)
    if (userType === 'institution') {
      router.push('/post-job');
    } else {
      setIsModalOpen(true);
    }
  };
  return (
    <div className="flex flex-col bg-white">

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome to PharmInc Jobs
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Your next career move or your next star employee is just a click away.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/find-jobs" className="no-underline">
              <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-all duration-200 bg-white rounded-xl border border-gray-200 p-6 text-center group hover:border-blue-300">
                <CardHeader className="p-0">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                    <List className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-gray-900 text-xl font-bold mb-2">I'm Looking for Jobs</CardTitle>
                  <CardDescription className="text-gray-600">
                    Browse and apply to the best healthcare jobs in India.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-0 pt-6">
                  <Button className="bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-sm text-white px-6 py-2">
                    Find Jobs
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Card 
              className="h-full flex flex-col justify-between hover:shadow-lg transition-all duration-200 bg-white rounded-xl border border-gray-200 p-6 text-center group hover:border-green-300 cursor-pointer"
              onClick={handlePostJobClick}
            >
              <CardHeader className="p-0">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                  <FilePlus className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-gray-900 text-xl font-bold mb-2">I Want to Post a Job</CardTitle>
                <CardDescription className="text-gray-600">
                  Recruit top talent by posting your job openings.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-0 pt-6">
                <Button className="bg-green-600 hover:bg-green-700 font-medium rounded-lg shadow-sm text-white px-6 py-2">
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-gray-600 text-sm">Active Job Listings</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900 mb-1">1000+</div>
              <div className="text-gray-600 text-sm">Healthcare Professionals</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900 mb-1">200+</div>
              <div className="text-gray-600 text-sm">Partner Institutions</div>
            </div>
          </div>
        </div>
      </div>

      <JobPostingInterestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default JobsLanding;
