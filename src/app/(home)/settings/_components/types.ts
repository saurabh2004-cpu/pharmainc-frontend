export interface UserDetails {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: string;
  specialization?: string;
  bio?: string;
  about?: string;
  profile_picture?: string;
  emailVerified?: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  jobAlerts: boolean;
  networkUpdates: boolean;
  postLikes: boolean;
  postComments: boolean;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
