
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import {
  createEducation,
  updateEducation,
  deleteEducation,
  getEducation,
} from "@/lib/api/services/userProfile";
import { toast } from "sonner";
import { ProfileSectionModal, FieldConfig } from "../ProfileSectionModal";
import { Education, EducationParams } from "@/lib/api/types";

interface ProfileEducationTabProps {
  userId: string;
  currentUserId?: string;
  onAdd: () => void;
  onEdit: (data: any) => void;
  refreshTrigger: number;
}

const formatDate = (dateString: string | null, isCurrent?: boolean) => {
  if (isCurrent) return "Present";
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export const ProfileEducationTab = ({ userId, currentUserId, onAdd, onEdit, refreshTrigger }: ProfileEducationTabProps) => {
  const isOwnProfile = currentUserId === userId;
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEducations = async () => {
    setIsLoading(true);
    try {
      // Using shared/public API to support viewing others

      const data = await getEducation();
      // Sort by startDate/start_date desc, handle both camelCase and snake_case
      const sorted = data.sort((a, b) => {
        const aStartDate = (a as any).startDate || a.start_date;
        const bStartDate = (b as any).startDate || b.start_date;
        return new Date(bStartDate).getTime() - new Date(aStartDate).getTime();
      });
      setEducations(sorted);
    } catch (error) {
      console.error("Failed to fetch educations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, [userId, refreshTrigger]);

  const handleEditClick = (edu: Education) => {
    // Handle both camelCase and snake_case
    const startDate = (edu as any).startDate || edu.start_date;
    const endDate = (edu as any).endDate || edu.end_date;

    onEdit({
      ...edu,
      startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : '',
      endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : '',
      instituteName: edu.instituteName || edu.institution_id,
      degree: edu.degree || edu.title,
      isCurrentJob: edu.isCurrentJob || !endDate
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return;
    try {
      await deleteEducation(id);
      toast.success("Education deleted");
      fetchEducations();
    } catch (e) {
      toast.error("Failed to delete education");
      console.error(e);
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border-gray-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between  border-b border-gray-100">
        <CardTitle className="text-xl font-bold text-gray-900">Education</CardTitle>
        {isOwnProfile && (
          <Button onClick={onAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Education
          </Button>
        )}
      </CardHeader>
      <CardContent className="">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading education...</div>
        ) : educations.length > 0 ? (
          <div className="space-y-6">
            {educations.map((edu) => (
              <div key={edu.id} className="relative flex gap-4 group">
                <div className="mt-1">
                  <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                    <GraduationCap className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.instituteName || "Unknown Institute"}</h3>
                      <p className="text-gray-700 font-medium">{edu.title || edu.degree}</p>
                    </div>
                    {isOwnProfile && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => handleEditClick(edu)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" onClick={() => handleDelete(edu.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>{formatDate((edu as any).startDate || edu.start_date)} - {formatDate((edu as any).endDate || edu.end_date, !((edu as any).endDate || edu.end_date))}</span>
                    {(edu.city || edu.country) && (
                      <>
                        <span>•</span>
                        <span>{edu.city}{edu.country ? `, ${edu.country}` : ''}</span>
                      </>
                    )}
                  </p>

                  {edu.description && (
                    <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500">No education listed yet.</p>
          </div>
        )}

      </CardContent>
    </Card>
  );
};
