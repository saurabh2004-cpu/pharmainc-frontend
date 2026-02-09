import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProfilePictureUrl(id: string, fileName?: string): string {
  if (fileName && fileName.includes('api/get-user-profile')) {
    return fileName; // Already a full URL
  }
  
  const filename = fileName || 'profile.png';
  return `/api/get-user-profile/${filename}?userId=${id}`;
}

// Alias for backward compatibility - both use the same endpoint now
export function getInstituteProfilePictureUrl(instituteId: string, fileName?: string): string {
  return getProfilePictureUrl(instituteId, fileName);
}

export function isProfilePictureUrl(url?: string): boolean {
  return Boolean(url && url.includes('/api/get-user-profile/'));
}
