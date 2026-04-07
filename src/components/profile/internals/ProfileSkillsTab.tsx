
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronsUpDown, Check } from "lucide-react";
import { useState, useEffect, KeyboardEvent } from "react";
import {
    getSkills,
    createSkills,
} from "@/lib/api/services/userProfile";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { skillOptions } from "@/lib/constants/skills";

interface ProfileSkillsTabProps {
    userId: string;
    currentUserId?: string;
    refreshTrigger: number;
}

export const ProfileSkillsTab = ({ userId, currentUserId, refreshTrigger }: ProfileSkillsTabProps) => {
    const isOwnProfile = currentUserId === userId;
    const [skills, setSkills] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch skills
    const fetchSkills = async () => {
        setIsLoading(true);
        try {
            const data = await getSkills(isOwnProfile ? undefined : userId);
            if (Array.isArray(data)) {
                setSkills(data);
                setSelectedSkills(data);
            } else if (data && 'skills' in data && Array.isArray(data.skills)) {
                setSkills(data.skills);
                setSelectedSkills(data.skills);
            } else {
                setSkills([]);
                setSelectedSkills([]);
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

    const toggleSkill = (skill: string) => {
        const isSelected = selectedSkills.includes(skill);
        if (isSelected) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSaveSkills = async () => {
        setIsSaving(true);
        try {
            await createSkills({ skills: selectedSkills });
            setSkills(selectedSkills);
            toast.success("Skills updated successfully");
        } catch (e) {
            console.error("Failed to update skills:", e);
            toast.error("Failed to update skills");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSkill = (skillToDelete: string) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skillToDelete));
    };

    return (
        <Card className="rounded-xl shadow-sm border-gray-200 bg-white">
            <CardHeader className=" border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add Skill Input - Only for own profile */}
                {isOwnProfile && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Add Skills</label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        disabled={isSaving}
                                        className="w-full hover:bg-[#ffffff] hover:text-white justify-between min-h-[44px] bg-gray-50 border-gray-200 px-3 py-2 h-auto"
                                    >
                                        <div className="flex flex-wrap gap-1 items-center text-left">
                                            {selectedSkills.length > 0 ? (
                                                selectedSkills.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="secondary"
                                                        className="flex items-center gap-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteSkill(skill);
                                                        }}
                                                    >
                                                        {skill}
                                                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" />
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-black">
                                                    Select skills...
                                                </span>
                                            )}
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search skills..." />
                                        <CommandList>
                                            <CommandGroup>
                                                {skillOptions.map((option) => {
                                                    const isSelected = selectedSkills.includes(option.value);
                                                    return (
                                                        <div
                                                            key={option.value}
                                                            className={cn(
                                                                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                                                "cursor-pointer hover:bg-[#169BA4] hover:text-white"
                                                            )}
                                                            onClick={() => toggleSkill(option.value)}
                                                            onMouseDown={(e) => e.preventDefault()}
                                                        >
                                                            <div className="flex items-center w-full">
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4 flex-shrink-0",
                                                                        isSelected ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <span className="flex-grow">{option.label}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSaveSkills}
                                disabled={isSaving || (JSON.stringify(skills) === JSON.stringify(selectedSkills))}
                                className="gap-2 bg-[#233F64] hover:bg-[#169BA4] h-10 px-8"
                            >
                                <Plus className="h-4 w-4" />
                                Add Skills
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Search and select skills from the dropdown, then click "Add Skills" to save your updates.
                        </p>
                    </div>
                )}

                {/* Skills Display - Only for other users' profiles */}
                {!isOwnProfile && (
                    <>
                        {isLoading ? (
                            <div className="text-center py-4 text-gray-500">Loading skills...</div>
                        ) : skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-gray-500">
                                    No skills listed yet.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
