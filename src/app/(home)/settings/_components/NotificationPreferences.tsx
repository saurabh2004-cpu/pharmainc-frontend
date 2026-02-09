"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Bell,
  Save
} from 'lucide-react';
import { NotificationSettings } from './types';

interface NotificationPreferencesProps {
  notifications: NotificationSettings;
  saving: boolean;
  onNotificationChange: (setting: keyof NotificationSettings, value: boolean) => void;
  onSave: () => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  notifications,
  saving,
  onNotificationChange,
  onSave
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => onNotificationChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => onNotificationChange('pushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Message Notifications</Label>
              <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
            </div>
            <Switch
              checked={notifications.messageNotifications}
              onCheckedChange={(checked) => onNotificationChange('messageNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Job Alerts</Label>
              <p className="text-sm text-gray-500">Receive notifications about new job opportunities</p>
            </div>
            <Switch
              checked={notifications.jobAlerts}
              onCheckedChange={(checked) => onNotificationChange('jobAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Network Updates</Label>
              <p className="text-sm text-gray-500">Get notified about updates from your network</p>
            </div>
            <Switch
              checked={notifications.networkUpdates}
              onCheckedChange={(checked) => onNotificationChange('networkUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Post Likes</Label>
              <p className="text-sm text-gray-500">Get notified when someone likes your posts</p>
            </div>
            <Switch
              checked={notifications.postLikes}
              onCheckedChange={(checked) => onNotificationChange('postLikes', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Post Comments</Label>
              <p className="text-sm text-gray-500">Get notified when someone comments on your posts</p>
            </div>
            <Switch
              checked={notifications.postComments}
              onCheckedChange={(checked) => onNotificationChange('postComments', checked)}
            />
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button 
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
