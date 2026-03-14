import { getInstitutionByIdServer, getUser } from "@/lib/api";
import { InstituteDetailsClient } from "./InstituteDetailsClient";
import { cookies } from "next/headers";

export default async function InstituteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const instituteData = await getInstitutionByIdServer(id);

    // Get current user ID from token or API
    let currentUserId: string | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('accessToken')?.value;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userIdFromToken = payload.userId || payload.sub || payload.id;
          if (userIdFromToken) {
            currentUserId = userIdFromToken;
          }
        } catch (error) {
          console.warn("Error decoding token:", error);
        }

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

    return (
      <InstituteDetailsClient 
        institutionData={instituteData} 
        instituteId={id}
        currentUserId={currentUserId} 
      />
    );
  } catch (error) {
    console.error("Error fetching institute details:", error);
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="text-4xl mb-4">🏫</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Institution Not Found</h2>
        <p className="text-gray-500">The institution you are looking for does not exist or has been removed.</p>
      </div>
    );
  }
}
