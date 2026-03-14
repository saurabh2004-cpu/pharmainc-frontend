"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useState } from "react";
import { Institution } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Users, 
  Bed, 
  University, 
  MapPin 
} from "lucide-react";

interface InstituteDetailsClientProps {
  institutionData: Institution;
  instituteId: string;
  currentUserId: string | null;
}

export function InstituteDetailsClient({ institutionData, instituteId, currentUserId }: InstituteDetailsClientProps) {
  const [institutionProfile, setInstitutionProfile] = useState(institutionData);

  const handleInstituteUpdate = (updatedInstitution: Institution) => {
    setInstitutionProfile(updatedInstitution);
  };

  // Utility to build image URL
  const buildImageUrl = (raw?: string | null): string | null => {
    if (!raw) return null;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/')) return raw;
    return `https://${raw}`;
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={null}
        institution={institutionProfile}
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
              {institutionProfile.bedsCount !== undefined && institutionProfile.bedsCount !== null && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Bed className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Beds Capacity</p>
                    <p className="text-gray-900 font-semibold">{institutionProfile.bedsCount}</p>
                  </div>
                </div>
              )}
              {institutionProfile.staffCount !== undefined && institutionProfile.staffCount !== null && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Medical Staff</p>
                    <p className="text-gray-900 font-semibold">{institutionProfile.staffCount}</p>
                  </div>
                </div>
              )}
              {institutionProfile.yearEstablished && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Established</p>
                    <p className="text-gray-900 font-semibold">{institutionProfile.yearEstablished}</p>
                  </div>
                </div>
              )}
              {institutionProfile.affiliatedUniversity && (
                <div className="col-span-1 sm:col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <University className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Affiliated University</p>
                    <p className="text-gray-900 font-semibold">{institutionProfile.affiliatedUniversity}</p>
                  </div>
                </div>
              )}
              {institutionProfile.ownership && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Ownership</p>
                    <p className="text-gray-900 font-semibold capitalize">{institutionProfile.ownership}</p>
                  </div>
                </div>
              )}
              {institutionProfile.city && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">City</p>
                    <p className="text-gray-900 font-semibold">{institutionProfile.city}</p>
                  </div>
                </div>
              )}
              {institutionProfile.country && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Country</p>
                    <p className="text-gray-900 font-semibold">{institutionProfile.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          {institutionProfile.services && institutionProfile.services.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {institutionProfile.services.map((service, index) => (
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
              {institutionProfile.contactEmail && (
                <div className="group flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Email Address</p>
                    <a href={`mailto:${institutionProfile.contactEmail}`} className="text-sm text-gray-900 font-medium hover:text-blue-600 truncate block transition-colors">
                      {institutionProfile.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {institutionProfile.contactNumber && (
                <div className="group flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Mobile Number</p>
                    <a href={`tel:${institutionProfile.contactNumber}`} className="text-sm text-gray-900 font-medium hover:text-blue-600 transition-colors">
                      {institutionProfile.contactNumber}
                    </a>
                  </div>
                </div>
              )}
              {institutionProfile.telephone && (
                <div className="group flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Telephone</p>
                    <a href={`tel:${institutionProfile.telephone}`} className="text-sm text-gray-900 font-medium hover:text-blue-600 transition-colors">
                      {institutionProfile.telephone}
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
