"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Stethoscope, GraduationCap, Building } from "lucide-react";
import { AuthFormHeader } from "./_components";

function AuthContent() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "signin";
  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={Stethoscope}
        title="Join the Medical Network"
        subtitle="Connect with colleagues, share research, and advance your career"
        showBackButton={false}
      />

      <div className="space-y-4 mb-8">
        <div className="flex flex-col gap-4">
          <Link href={`/auth/doctor?type=${type}`}>
            <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center overflow-hidden z-10">
                    <Stethoscope className="h-5 w-5 text-[#3B82F6]" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center overflow-hidden -ml-3 z-20">
                    <Stethoscope className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-pink-200 border-2 border-white flex items-center justify-center overflow-hidden -ml-3 z-10">
                    <Stethoscope className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">For Health Care Professionals</h3>
                  <p className="text-gray-600 text-sm">
                    Explore exclusive resources and tools tailored for healthcare professionals.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href={`/auth/institute?type=${type}`}>
            <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-200 border-2 border-white flex items-center justify-center overflow-hidden z-10">
                    <Building className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center overflow-hidden -ml-3 z-20">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center overflow-hidden -ml-3 z-10">
                    <Building className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    For Institutions
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover opportunities and resources designed for institutions to foster growth and collaboration.
                  </p>
                </div>
              </div>
            </div>
          </Link>


          <Link href={`/auth/student?type=${type}`}>
            <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-white flex items-center justify-center overflow-hidden z-10">
                    <GraduationCap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-200 border-2 border-white flex items-center justify-center overflow-hidden -ml-3 z-20">
                    <GraduationCap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-200 border-2 border-white flex items-center justify-center overflow-hidden -ml-3 z-10">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    For Students
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Access tailored resources and opportunities to support your educational journey and career growth.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
