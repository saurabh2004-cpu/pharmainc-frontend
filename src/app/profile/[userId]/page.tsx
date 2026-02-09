import { getUserById, getUser, User, Institution } from "@/lib/api";
import { ProfilePageClient } from "./ProfilePageClient";
import { cookies } from "next/headers";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  try {
    let profileData: User | null = null;
    let instituteData: Institution | null = null;

    try {
      profileData = await getUserById(userId);
    } catch (userError) {
      try {
        const { getInstitutionById } = await import("@/lib/api/services/institute");
        instituteData = await getInstitutionById(userId);
      } catch (instituteError) {
        console.warn("Failed to fetch profile as user or institution");
        throw instituteError;
      }
    }

    // Get current user ID from token or API
    let currentUserId: string | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('accessToken')?.value;

      if (token) {
        try {
          // First try to decode from JWT token
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userIdFromToken = payload.userId || payload.sub || payload.id;
          if (userIdFromToken) {
            currentUserId = userIdFromToken;
          }
        } catch (error) {
          console.warn("Error decoding token, fetching user data:", error);
        }

        // If token decode fails, fetch current user data
        if (!currentUserId) {
          try {
            const currentUser = await getUser();
            currentUserId = currentUser.id;
          } catch (error) {
            console.error("Error fetching current user:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error getting current user ID:", error);
    }

    return <ProfilePageClient profileData={profileData} instituteData={instituteData} currentUserId={currentUserId} userId={userId} />;
  } catch (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-700">Profile not found</div>
      </div>
    );
  }
}
