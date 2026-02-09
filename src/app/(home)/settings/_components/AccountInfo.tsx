"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase,
  Save,
  CheckCircle,
  AlertCircle,
  Phone
} from 'lucide-react';
import { UserDetails } from './types';

interface AccountInfoProps {
  userDetails: UserDetails;
  originalDetails: UserDetails;
  saving: boolean;
  onInputChange: (field: keyof UserDetails, value: string) => void;
  onSave: () => void;
  onVerifyEmail: () => void;
  verifyingEmail: boolean;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  userDetails,
  originalDetails,
  saving,
  onInputChange,
  onSave,
  onVerifyEmail,
  verifyingEmail
}) => {
  const hasChanges = JSON.stringify(userDetails) !== JSON.stringify(originalDetails);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Update your personal information and profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={userDetails.name || ''}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="email"
                type="email"
                value={userDetails.email || ''}
                onChange={(e) => onInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <div className="flex items-center gap-2">
              {userDetails.emailVerified ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <>
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onVerifyEmail}
                    disabled={verifyingEmail}
                  >
                    {verifyingEmail ? 'Sending...' : 'Verify'}
                  </Button>
                </>
              )}
            </div>
          </div>
          {!userDetails.emailVerified && (
            <p className="text-sm text-amber-600">
              Please verify your email address to ensure you receive important notifications.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={userDetails.phone || ''}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <Input
            id="location"
            value={userDetails.location || ''}
            onChange={(e) => onInputChange('location', e.target.value)}
            placeholder="Enter your location"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Role
            </Label>
            <Input
              id="role"
              value={userDetails.role || ''}
              onChange={(e) => onInputChange('role', e.target.value)}
              placeholder="Enter your role"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={userDetails.specialization || ''}
              onChange={(e) => onInputChange('specialization', e.target.value)}
              placeholder="Enter your specialization"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={userDetails.bio || ''}
            onChange={(e) => onInputChange('bio', e.target.value)}
            placeholder="Enter your bio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="about">About</Label>
          <Input
            id="about"
            value={userDetails.about || ''}
            onChange={(e) => onInputChange('about', e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button 
            onClick={onSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfo;
