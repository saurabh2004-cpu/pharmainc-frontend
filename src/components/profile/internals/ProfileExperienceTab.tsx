
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react"; // Building2 for fallback icon
import { useState, useEffect } from "react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/api/services/userProfile";
import { searchInstitutions } from "@/lib/api";
import { toast } from "sonner";
import { ProfileSectionModal, FieldConfig } from "../ProfileSectionModal";
import { Experience, ExperienceParams } from "@/lib/api/types";

interface ProfileExperienceTabProps {
  userId: string;
  currentUserId?: string;
  onAdd?: () => void;
  onEdit?: (data: any) => void;
  refreshTrigger?: number;
}

// Date formatting utility
const formatDate = (dateString: string | null, isCurrent?: boolean) => {
  if (isCurrent) return "Present";
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export const ProfileExperienceTab = ({ userId, currentUserId, onAdd, onEdit, refreshTrigger }: ProfileExperienceTabProps) => {
  const isOwnProfile = currentUserId === userId;
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch experiences
  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const data = await getExperiences();
      // Sort by start_date desc
      const sorted = data.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
      setExperiences(sorted);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
      // toast.error("Failed to fetch experience data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        let data: Experience[] = [];

        if (isOwnProfile) {
          // Use private API for own profile to get the latest data immediately
          data = await getExperiences();
        } else {
          // Use public API for viewing other users
          const { getUserExperiences } = await import("@/lib/api");
          data = await getUserExperiences(userId);
        }

        // Sort: Current jobs first (endDate/end_date is null), then by startDate/start_date descending
        const sorted = data.sort((a, b) => {
          // Handle both camelCase (Prisma) and snake_case (API types)
          const aEndDate = (a as any).endDate || a.end_date;
          const bEndDate = (b as any).endDate || b.end_date;
          const aStartDate = (a as any).startDate || a.start_date;
          const bStartDate = (b as any).startDate || b.start_date;

          // Current jobs (no endDate) come first
          const aIsCurrent = !aEndDate;
          const bIsCurrent = !bEndDate;

          if (aIsCurrent && !bIsCurrent) return -1;
          if (!aIsCurrent && bIsCurrent) return 1;

          // If both current or both past, sort by startDate descending (most recent first)
          return new Date(bStartDate).getTime() - new Date(aStartDate).getTime();
        });
        setExperiences(sorted);
      } catch (e) {
        console.error("Failed to fetch experiences:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, isOwnProfile, refreshTrigger]);


  const handleEditClick = (exp: Experience) => {
    // Handle both camelCase and snake_case
    const startDate = (exp as any).startDate || exp.start_date;
    const endDate = (exp as any).endDate || exp.end_date;

    if (onEdit) {
      onEdit({
        ...exp,
        startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : '',
        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : '',
        organizationName: exp.organizationName || exp.institutionName,
        isCurrentJob: !endDate
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(id);
      toast.success("Experience deleted");
      // Refresh
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (e) {
      toast.error("Failed to delete experience");
      console.error(e);
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border-gray-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between  border-b border-gray-100">
        <CardTitle className="text-xl font-bold text-gray-900">Experience</CardTitle>
        {isOwnProfile && (
          <Button onClick={onAdd} size="sm" className="gap-2 bg-[#233F64] hover:bg-[#169BA4]">
            <Plus className="h-4 w-4" /> Add Experience
          </Button>
        )}
      </CardHeader>
      <CardContent className="">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading experience...</div>
        ) : experiences.length > 0 ? (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative flex gap-4 group">
                <div className="mt-1">
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    {/* We could use institutionLogo if available, else generic */}
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title || exp.role}</h3>
                      <p className="text-gray-700 font-medium">{exp.organizationName || exp.institutionName}</p>
                    </div>
                    {isOwnProfile && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="hover:text-white h-8 w-8 text-gray-500 hover:bg-[#169BA4]" onClick={() => handleEditClick(exp)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-[#169BA4]" onClick={() => handleDelete(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>{formatDate((exp as any).startDate || exp.start_date)} - {formatDate((exp as any).endDate || exp.end_date, !((exp as any).endDate || exp.end_date))}</span>
                    <span>•</span>
                    <span>{exp.city}{exp.country ? `, ${exp.country}` : ''}</span>
                    {exp.locationType && (
                      <>
                        <span>•</span>
                        <span>{exp.locationType}</span>
                      </>
                    )}
                  </p>

                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500">No experience listed yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
