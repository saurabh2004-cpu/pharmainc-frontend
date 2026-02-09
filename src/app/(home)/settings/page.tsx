"use client";

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Lock, 
  Bell
} from 'lucide-react';
import { getUser } from '@/lib/api/services/user';
import { 
  AccountInfo, 
  PasswordSettings, 
  NotificationPreferences,
  UserDetails,
  NotificationSettings,
  PasswordData
} from './_components';

const SettingsPage = () => {
  const { currentUser, fetchCurrentUser } = useUserStore();
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [originalDetails, setOriginalDetails] = useState<UserDetails>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    jobAlerts: true,
    networkUpdates: false,
    postLikes: true,
    postComments: true,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!currentUser) {
          await fetchCurrentUser();
        }
        
        // Fetch detailed user data
        const userData = await getUser();
        const details = {
          id: userData.id,
          name: userData.name,
          email: userData.email || '',
          phone: (userData as any).phone || '',
          location: userData.location || '',
          role: userData.role || '',
          specialization: userData.specialization || '',
          bio: userData.bio || '',
          about: userData.about || '',
          profile_picture: userData.profile_picture || '',
          emailVerified: (userData as any).emailVerified || false,
        };
        
        setUserDetails(details);
        setOriginalDetails(details);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, fetchCurrentUser]);

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Here you would typically make an API call to update the user profile
      console.log('Saving profile:', userDetails);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalDetails(userDetails);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setSaving(true);
    try {
      // Here you would typically make an API call to change the password
      console.log('Changing password');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      // Simulate API call to send verification email
      console.log('Sending verification email to:', userDetails.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Error sending verification email. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      // Here you would typically make an API call to update notification preferences
      console.log('Saving notifications:', notifications);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error saving notifications:', error);
      alert('Error updating notification preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountInfo
            userDetails={userDetails}
            originalDetails={originalDetails}
            saving={saving}
            onInputChange={handleInputChange}
            onSave={handleSaveProfile}
            onVerifyEmail={handleVerifyEmail}
            verifyingEmail={verifyingEmail}
          />
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <PasswordSettings
            passwordData={passwordData}
            saving={saving}
            onPasswordChange={handlePasswordChange}
            onChangePassword={handleChangePassword}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationPreferences
            notifications={notifications}
            saving={saving}
            onNotificationChange={handleNotificationChange}
            onSave={handleSaveNotifications}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;