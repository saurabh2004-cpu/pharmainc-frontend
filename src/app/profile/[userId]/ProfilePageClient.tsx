"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileAboutTab } from "@/components/profile/internals/ProfileAboutTab";
import { ProfileExperienceTab } from "@/components/profile/internals/ProfileExperienceTab";
import { ProfileEducationTab } from "@/components/profile/internals/ProfileEducationTab";
import { ProfilePostsTab } from "@/components/profile/internals/ProfilePostsTab";
import { ProfileActivityTab } from "@/components/profile/internals/ProfileActivityTab";
import { ProfileSpecialtyTab } from "@/components/profile/internals/ProfileSpecialtyTab";
import { ProfileSkillsTab } from "@/components/profile/internals/ProfileSkillsTab";
import { useState, useEffect } from "react";
import { User, Institution } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building2, Calendar, Users, Bed, University, MapPin } from "lucide-react";
import { ProfileSectionModal, FieldConfig } from "@/components/profile/ProfileSectionModal";
import { createExperience, updateExperience, createEducation, updateEducation } from "@/lib/api/services/userProfile";
import { toast } from "sonner";

interface ProfilePageClientProps {
  profileData?: User | null;
  instituteData?: Institution | null;
  currentUserId?: string | null;
  userId: string;
}

import { getUserById } from "@/lib/api";
import { getInstitutionById } from "@/lib/api/services/institute";
import { getUser } from "@/lib/api/services/user";

export function ProfilePageClient({ profileData, instituteData, currentUserId, userId }: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState("Experience");
  const [userData, setUserData] = useState<User | null>(profileData || null);
  const [instituteProfile, setInstituteProfile] = useState<Institution | null>(instituteData || null);
  const [loading, setLoading] = useState(!profileData && !instituteData);
  const [error, setError] = useState<string | null>(null);
  const [fetchedCurrentUserId, setFetchedCurrentUserId] = useState<string | null>(currentUserId || null);

  useEffect(() => {
    // If we already have data (passed from server), don't fetch
    if (profileData || instituteData) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Try fetching current user ID if missing
        if (!fetchedCurrentUserId) {
          try {
            const currentUser = await getUser();
            setFetchedCurrentUserId(currentUser.id);
          } catch (e) {
            console.error("Failed to fetch current user", e);
          }
        }

        // 2. Try fetching as User
        try {
          const user = await getUserById(userId);
          setUserData(user);
        } catch (userError) {
          // 3. Keep trying as Institute
          try {
            const institute = await getInstitutionById(userId);
            setInstituteProfile(institute);
          } catch (instituteError) {
            console.error("Failed to fetch profile as user or institution");
            setError("Profile not found");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, profileData, instituteData]);

  // Debug (Temporary)
  console.log("ProfilePageClient Debug:", { currentUserId, userId, isOwnProfile: currentUserId === userId });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'experience' | 'education' | 'skills' | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editData, setEditData] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Field Configurations
  const experienceFields: FieldConfig[] = [
    { name: 'organizationName', label: 'Organization Name', type: 'text', placeholder: 'Ex: Mayo Clinic', required: true },
    { name: 'role', label: 'Role / Title', type: 'text', placeholder: 'Ex: Senior Nurse', required: true },
    { name: 'locationType', label: 'Location Type', type: 'select', options: [{ label: 'On-site', value: 'On-site' }, { label: 'Remote', value: 'Remote' }, { label: 'Hybrid', value: 'Hybrid' }] },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', disabled: (data) => data.isCurrentJob },
    { name: 'isCurrentJob', label: 'I currently work here', type: 'checkbox' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  const educationFields: FieldConfig[] = [
    { name: 'instituteName', label: 'Institute Name', type: 'text', placeholder: 'Ex: Harvard University', required: true },
    { name: 'degree', label: 'Degree', type: 'text', placeholder: 'Ex: Bachelor of Science', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', disabled: (data) => data.isCurrentJob },
    { name: 'isCurrentJob', label: 'I am currently studying here', type: 'checkbox' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];



  const handleCreate = (type: 'experience' | 'education') => {
    setModalType(type);
    setModalMode('create');
    setEditData({});
    setIsModalOpen(true);
  };

  const handleEdit = (type: 'experience' | 'education', data: any) => {
    setModalType(type);
    setModalMode('edit');
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (modalType === 'experience') {
        const payload = {
          organizationName: data.organizationName,
          title: data.title || data.role,
          role: data.role || data.title,
          start_date: data.startDate,
          end_date: data.isCurrentJob ? null : data.endDate,
          description: data.description,
          locationType: data.locationType,
          country: data.country,
          city: data.city,
          isCurrentJob: data.isCurrentJob
        };
        if (modalMode === 'edit' && editData?.id) {
          await updateExperience(editData.id, payload);
          toast.success("Experience updated");
        } else {
          await createExperience(payload);

          toast.success("Experience added");
        }
      } else if (modalType === 'education') {
        const payload = {
          instituteName: data.instituteName,
          title: data.title || data.degree,
          degree: data.degree || data.title,
          start_date: data.startDate,
          end_date: data.isCurrentJob ? null : data.endDate,
          description: data.description,
          country: data.country,
          city: data.city,
          isCurrentJob: data.isCurrentJob
        };
        if (modalMode === 'edit' && editData?.id) {
          await updateEducation(editData.id, payload);
          toast.success("Education updated");
        } else {
          await createEducation(payload);
          toast.success("Education added");
        }
      }

      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to save ${modalType}`);
    }
  };
  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser);
  };

  const handleInstituteUpdate = (updatedInstitute: Institution) => {
    setInstituteProfile(updatedInstitute);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || (!userData && !instituteProfile)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-xl text-gray-700">{error || "Profile not found"}</div>
      </div>
    );
  }

  // Render Institute Profile
  if (instituteProfile) {
    return (
      <div className="space-y-6">
        <ProfileHeader
          user={null}
          institution={instituteProfile}
          currentUserId={currentUserId || ""}
          onInstituteUpdate={handleInstituteUpdate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Key Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Key Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {instituteProfile.bedsCount !== undefined && instituteProfile.bedsCount !== null && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <Bed className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Beds Capacity</p>
                      <p className="text-gray-900 font-semibold">{instituteProfile.bedsCount}</p>
                    </div>
                  </div>
                )}
                {instituteProfile.staffCount !== undefined && instituteProfile.staffCount !== null && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Medical Staff</p>
                      <p className="text-gray-900 font-semibold">{instituteProfile.staffCount}</p>
                    </div>
                  </div>
                )}
                {instituteProfile.yearEstablished && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Established</p>
                      <p className="text-gray-900 font-semibold">{instituteProfile.yearEstablished}</p>
                    </div>
                  </div>
                )}
                {instituteProfile.affiliatedUniversity && (
                  <div className="col-span-1 sm:col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <University className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Affiliated University</p>
                      <p className="text-gray-900 font-semibold">{instituteProfile.affiliatedUniversity}</p>
                    </div>
                  </div>
                )}
                {instituteProfile.ownership && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Ownership</p>
                      <p className="text-gray-900 font-semibold capitalize">{instituteProfile.ownership}</p>
                    </div>
                  </div>
                )}
                {instituteProfile.city && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">City</p>
                      <p className="text-gray-900 font-semibold">{instituteProfile.city}</p>
                    </div>
                  </div>
                )}
                {instituteProfile.country && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Country</p>
                      <p className="text-gray-900 font-semibold">{instituteProfile.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {instituteProfile.services && instituteProfile.services.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {instituteProfile.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                {instituteProfile.contactEmail && (
                  <div className="group flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Email Address</p>
                      <a href={`mailto:${instituteProfile.contactEmail}`} className="text-sm text-gray-900 font-medium hover:text-blue-600 truncate block transition-colors">
                        {instituteProfile.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {instituteProfile.contactNumber && (
                  <div className="group flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Mobile Number</p>
                      <a href={`tel:${instituteProfile.contactNumber}`} className="text-sm text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        {instituteProfile.contactNumber}
                      </a>
                    </div>
                  </div>
                )}
                {instituteProfile.telephone && (
                  <div className="group flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Telephone</p>
                      <a href={`tel:${instituteProfile.telephone}`} className="text-sm text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        {instituteProfile.telephone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render User Profile (existing logic)
  return (
    <div className="space-y-4">
      <ProfileHeader
        user={userData}
        institution={null}
        currentUserId={currentUserId || ""}
        onUserUpdate={handleUserUpdate}
      />

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={
          userData?.role?.toLowerCase() === 'student'
            ? ["Education", "Skills", "Specialty"]
            : ["Experience", "Education", "Skills", "Specialty"]
        }
      />

      {/* Debug Info - Remove before production */}
      {/* <div className="p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded mb-4">
        <p><strong>Debug Info:</strong></p>
        <p>Current User ID: {currentUserId || 'null'}</p>
        <p>Profile User ID: {userId}</p>
        <p>Is Own Profile: {currentUserId === userId ? 'Yes' : 'No'}</p>
      </div> */}

      <div className="space-y-4">
        {activeTab === "About" && (
          <ProfileAboutTab userId={userId} />
        )}
        {activeTab === "Experience" && (
          <ProfileExperienceTab
            userId={userId}
            currentUserId={currentUserId?.toString() || ""}
            onAdd={() => handleCreate('experience')}
            onEdit={(data) => handleEdit('experience', data)}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === "Education" && (
          <ProfileEducationTab
            userId={userId}
            currentUserId={currentUserId?.toString() || ""}
            onAdd={() => handleCreate('education')}
            onEdit={(data) => handleEdit('education', data)}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === "Skills" && (
          <ProfileSkillsTab
            userId={userId}
            currentUserId={currentUserId?.toString() || ""}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === "Specialty" && (
          <ProfileSpecialtyTab userId={userId} currentUserId={currentUserId?.toString() || ""} />
        )}
        {activeTab === "Posts" && <ProfilePostsTab userId={userId} />}
        {activeTab === "Activity" && <ProfileActivityTab />}

        <ProfileSectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${modalMode === 'create' ? 'Add' : 'Edit'} ${modalType ? modalType.charAt(0).toUpperCase() + modalType.slice(1) : ''}`}
          fields={modalType === 'experience' ? experienceFields : educationFields}
          initialData={editData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}