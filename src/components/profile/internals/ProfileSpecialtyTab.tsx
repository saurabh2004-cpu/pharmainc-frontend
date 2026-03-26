
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState, useEffect, KeyboardEvent } from "react";
import {
  getSpecialities,
  createSpecialities,
} from "@/lib/api/services/userProfile";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ProfileSpecialtyTabProps {
  userId: string;
  currentUserId?: string;
  refreshTrigger?: number;
}

export const ProfileSpecialtyTab = ({ userId, currentUserId, refreshTrigger }: ProfileSpecialtyTabProps) => {
  const isOwnProfile = currentUserId === userId;
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newSpeciality, setNewSpeciality] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch specialities
  const fetchSpecialities = async () => {
    setIsLoading(true);
    try {
      const data = await getSpecialities();
      if (Array.isArray(data)) {
        setSpecialities(data);
      } else if (data && 'specialities' in data && Array.isArray(data.specialities)) {
        setSpecialities(data.specialities);
      } else {
        setSpecialities([]);
      }
    } catch (error) {
      console.error("Failed to fetch specialities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, [userId, refreshTrigger]);

  const handleAddSpeciality = async () => {
    const trimmedSpeciality = newSpeciality.trim();

    // Validation
    if (!trimmedSpeciality) {
      toast.error("Speciality cannot be empty");
      return;
    }

    // Check for duplicates (case-insensitive)
    const specialityExists = specialities.some(s => s.toLowerCase() === trimmedSpeciality.toLowerCase());
    if (specialityExists) {
      toast.error("Speciality already exists");
      setNewSpeciality("");
      return;
    }

    setIsSaving(true);
    try {
      const updatedSpecialities = [...specialities, trimmedSpeciality];
      await createSpecialities({ specialities: updatedSpecialities });
      setSpecialities(updatedSpecialities);
      setNewSpeciality("");
      toast.success("Speciality added");
    } catch (e) {
      console.error("Failed to add speciality:", e);
      toast.error("Failed to add speciality");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSpeciality = async (specialityToDelete: string) => {
    if (!confirm(`Remove "${specialityToDelete}"?`)) return;

    setIsSaving(true);
    try {
      const updatedSpecialities = specialities.filter(s => s !== specialityToDelete);
      await createSpecialities({ specialities: updatedSpecialities });
      setSpecialities(updatedSpecialities);
      toast.success("Speciality removed");
    } catch (e) {
      console.error("Failed to remove speciality:", e);
      toast.error("Failed to remove speciality");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpeciality();
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border-gray-200 bg-white">
      <CardHeader className=" border-b border-gray-100">
        <CardTitle className="text-xl font-bold text-gray-900">Specialties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Speciality Input - Only for own profile */}
        {isOwnProfile && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Enter a specialty (e.g., Cardiology, Pediatrics)"
                value={newSpeciality}
                onChange={(e) => setNewSpeciality(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSaving}
                className="flex-1 text-sm sm:text-base"
              />
              <Button
                onClick={handleAddSpeciality}
                disabled={!newSpeciality.trim() || isSaving}
                className="gap-2 bg-[#233F64] hover:bg-[#169BA4] w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Add specialties one by one. Press Enter or click Add to save.
            </p>
          </div>
        )}

        {/* Specialities Display */}
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading specialties...</div>
        ) : specialities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {specialities.map((speciality) => (
              <Badge
                key={speciality}
                variant="secondary"
                className="px-3 py-1.5 text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-2"
              >
                {speciality}
                {isOwnProfile && (
                  <button
                    onClick={() => handleDeleteSpeciality(speciality)}
                    className="text-purple-500 hover:text-purple-700 focus:outline-none transition-colors"
                    disabled={isSaving}
                    aria-label={`Remove ${speciality}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500">
              {isOwnProfile ? "No specialties added yet. Add your first specialty above!" : "No specialties listed yet."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
