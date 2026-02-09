import { getUserById } from "@/lib/api/services/user";

export interface UserInfo {
  name: string;
  avatar: string;
  role: string;
  specialization?: string;
  location?: string;
}

const userCache = new Map<string, UserInfo>();

export const getUserInfo = async (userId: string): Promise<UserInfo> => {
  if (userCache.has(userId)) {
    return userCache.get(userId)!;
  }

  try {
    const user = await getUserById(userId);
    const userData: UserInfo = {
      name: user.name || "Unknown User",
      avatar: user.profile_picture || "/pp.png",
      role: user.role || "Medical Professional",
      specialization: user.specialization,
      location: user.location
    };
    
    userCache.set(userId, userData);
    return userData;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    return {
      name: "Anonymous User",
      avatar: "/pp.png",
      role: "User"
    };
  }
};

export const clearUserCache = () => {
  userCache.clear();
};
