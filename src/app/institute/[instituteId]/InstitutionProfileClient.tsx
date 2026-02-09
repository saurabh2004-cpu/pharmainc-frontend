"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileAboutTab } from "@/components/profile/internals/ProfileAboutTab";
import { ProfileExperienceTab } from "@/components/profile/internals/ProfileExperienceTab";
import { ProfileEducationTab } from "@/components/profile/internals/ProfileEducationTab";
import { ProfilePostsTab } from "@/components/profile/internals/ProfilePostsTab";
import { ProfileActivityTab } from "@/components/profile/internals/ProfileActivityTab";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Institution } from "@/lib/api";
import { useInstitutionStore } from "@/store";

interface InstitutionProfileClientProps {
  institutionData: Institution;
  instituteId: string;
}

export function InstitutionProfileClient({ institutionData, instituteId }: InstitutionProfileClientProps) {
  const [activeTab, setActiveTab] = useState("Posts");

  const [institutionProfile, setInstitutionProfile] = useState(institutionData);
  const { setInstitution } = useInstitutionStore();

  const handleInstituteUpdate = (updatedInstitution: Institution) => {
    setInstitutionProfile(updatedInstitution);
    // Update the store if it's the current institution
    setInstitution(updatedInstitution);
  };

  // Convert institution data to user format for compatibility with existing components
  const institutionAsUser = {
    id: institutionProfile?.id || "",
    name: institutionProfile?.name || "",
    role: institutionProfile?.type || "",
    profile_picture: institutionProfile?.profile_picture,
    banner_picture: institutionProfile?.banner_picture,
    bio: institutionProfile?.bio,
    about: institutionProfile?.about,
    followers: institutionProfile?.followers,
    connections: 0,
    created_at: institutionProfile?.created_at || "",
    updated_at: institutionProfile?.updated_at || "",
    email: "",
    location: institutionProfile?.location,
    verified: institutionProfile?.verified,
  };

  if (!institutionProfile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading institution...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Institution Header */}
      <Card className="rounded-xl shadow-lg border-0 overflow-hidden bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
        <ProfileHeader
          user={institutionAsUser}
          institution={institutionProfile}
          currentUserId={instituteId}
          onInstituteUpdate={handleInstituteUpdate}
        />
      </Card>

      {/* Institution Tabs */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "About" && (
          <ProfileAboutTab userId={instituteId} />
        )}
        {activeTab === "Experience" && (
          <ProfileExperienceTab userId={instituteId} />
        )}
        {activeTab === "Education" && (
          <ProfileEducationTab userId={instituteId} />
        )}
        {activeTab === "Posts" && <ProfilePostsTab userId={instituteId} />}
        {activeTab === "Activity" && <ProfileActivityTab />}
      </div>
    </div>
  );
} 