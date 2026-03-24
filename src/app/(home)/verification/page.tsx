"use client";

import React, { useState, useEffect } from "react";
import { Shield, CheckCircle2, Loader2, ArrowLeft, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEntityStore } from "@/store/entityStore";
import { getVerificationByUserId, getInstituteVerificationByInstituteId, getUserType } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { UserVerificationForm } from "./components/UserVerificationForm";
import { InstituteVerificationForm } from "./components/InstituteVerificationForm";

export default function VerificationPage() {
  const router = useRouter();
  const { entity, isLoading: isEntityLoading } = useEntityStore();
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const userType = getUserType();

  // Fetch verification status on load
  const fetchVerificationStatus = async () => {
    if (entity?.id) {
      setIsStatusLoading(true);
      try {
        if (userType === "INSTITUTE") {
          const data = await getInstituteVerificationByInstituteId(entity.id);
          if (data) {
            setVerificationStatus(data.status || data); // Store status
          }
        } else {
          const data = await getVerificationByUserId(entity.id);
          if (data) {
            setVerificationStatus(data.status || data); // Store status
          }
        }
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
      } finally {
        setIsStatusLoading(false);
      }
    } else if (!isEntityLoading) {
      setIsStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, [entity?.id, isEntityLoading]);

  if (isEntityLoading || isStatusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (verificationStatus && verificationStatus !== "REJECTED") {
    const isApproved = verificationStatus === "APPROVED";

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 space-y-8 max-w-2xl mx-auto">
        <div className={`p-6 rounded-full ${isApproved ? "bg-green-100" : "bg-amber-100"} animate-in zoom-in duration-500`}>
          {isApproved ? (
            <CheckCircle2 className="w-20 h-20 text-green-600" />
          ) : (
            <Clock className="w-20 h-20 text-amber-600" />
          )}
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {isApproved ? "You Are Verified" : "Verification Under Review"}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {isApproved
              ? "Congratulations! Your account has been successfully verified."
              : userType === "INSTITUTE"
                ? "Your institute verification is under review."
                : "Your verification is currently under process. We will notify you once it is completed."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <Button variant="outline" onClick={() => router.back()} size="lg" className="px-8 h-14 text-lg bg-[#233F64] hover:bg-[#169BA4] hover:text-white text-white">
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 font-sans">Verification</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Authenticated as <span className="font-semibold text-gray-900">{(entity as any)?.email || (entity as any)?.contactEmail}</span></p>
          </div>
        </div>
      </div>

      {userType === "INSTITUTE" ? (
        <InstituteVerificationForm
          verificationStatus={verificationStatus}
          setVerificationStatus={setVerificationStatus}
        />
      ) : (
        <UserVerificationForm
          verificationStatus={verificationStatus}
          setVerificationStatus={setVerificationStatus}
        />
      )}
    </div>
  );
}
