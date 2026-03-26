
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState, useEffect, KeyboardEvent } from "react";
import {
    getSkills,
    createSkills,
    deleteSkills
} from "@/lib/api/services/userProfile";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ProfileSkillsTabProps {
    userId: string;
    currentUserId?: string;
    refreshTrigger: number;
}

export const ProfileSkillsTab = ({ userId, currentUserId, refreshTrigger }: ProfileSkillsTabProps) => {
    const isOwnProfile = currentUserId === userId;
    const [skills, setSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Fetch skills
    const fetchSkills = async () => {
        setIsLoading(true);
        try {
            const data = await getSkills();
            if (Array.isArray(data)) {
                setSkills(data);
            } else if (data && 'skills' in data && Array.isArray(data.skills)) {
                setSkills(data.skills);
            } else {
                setSkills([]);
            }
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, [userId, refreshTrigger]);

    const handleAddSkill = async () => {
        const trimmedSkill = newSkill.trim();

        // Validation
        if (!trimmedSkill) {
            toast.error("Skill cannot be empty");
            return;
        }

        // Check for duplicates (case-insensitive)
        const skillExists = skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase());
        if (skillExists) {
            toast.error("Skill already exists");
            setNewSkill("");
            return;
        }

        setIsSaving(true);
        try {
            const updatedSkills = [...skills, trimmedSkill];
            await createSkills({ skills: updatedSkills });
            setSkills(updatedSkills);
            setNewSkill("");
            toast.success("Skill added");
        } catch (e) {
            console.error("Failed to add skill:", e);
            toast.error("Failed to add skill");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSkill = async (skillToDelete: string) => {
        if (!confirm(`Remove "${skillToDelete}"?`)) return;

        setIsSaving(true);
        try {
            const updatedSkills = skills.filter(s => s !== skillToDelete);
            await createSkills({ skills: updatedSkills });
            setSkills(updatedSkills);
            toast.success("Skill removed");
        } catch (e) {
            console.error("Failed to remove skill:", e);
            toast.error("Failed to remove skill");
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <Card className="rounded-xl shadow-sm border-gray-200 bg-white">
            <CardHeader className=" border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add Skill Input - Only for own profile */}
                {isOwnProfile && (
                    <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                type="text"
                                placeholder="Enter a skill (e.g., React, Node.js)"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isSaving}
                                className="flex-1 text-sm sm:text-base"
                            />
                            <Button
                                onClick={handleAddSkill}
                                disabled={!newSkill.trim() || isSaving}
                                className="gap-2 bg-[#233F64] hover:bg-[#169BA4] w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
                            >
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Add skills one by one. Press Enter or click Add to save.
                        </p>
                    </div>
                )}

                {/* Skills Display */}
                {isLoading ? (
                    <div className="text-center py-4 text-gray-500">Loading skills...</div>
                ) : skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-2"
                            >
                                {skill}
                                {isOwnProfile && (
                                    <button
                                        onClick={() => handleDeleteSkill(skill)}
                                        className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors"
                                        disabled={isSaving}
                                        aria-label={`Remove ${skill}`}
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
                            {isOwnProfile ? "No skills added yet. Add your first skill above!" : "No skills listed yet."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
