"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getUser, updateUser } from "@/lib/api";
import { toast } from "sonner";

interface ProfileAboutTabProps {
  userId: string; // Only need userId to fetch data
}

export const ProfileAboutTab = ({ userId }: ProfileAboutTabProps) => {
  const [aboutText, setAboutText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch about data when component mounts
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const userData = await getUser();
        setAboutText(userData?.about || "");
      } catch (error) {
        console.error("Failed to fetch about data:", error);
        toast.error("Failed to load about section");
      } finally {
        setInitialLoad(false);
      }
    };

    fetchAbout();
  }, [userId]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUser({ about: aboutText });
      toast.success("About section updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update about section:", error);
      toast.error("Failed to update about section");
      // Revert to current saved state
      const userData = await getUser();
      setAboutText(userData?.about || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Revert to last saved state
    getUser()
      .then((userData) => setAboutText(userData?.about || ""))
      .catch(console.error);
    setIsEditing(false);
  };

  if (initialLoad) {
    return (
      <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Loading about section...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-2xl">About</CardTitle>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Tell others about yourself..."
              className="min-h-[150px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {aboutText ||
              "No about info set. Click the edit button to add one."}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
