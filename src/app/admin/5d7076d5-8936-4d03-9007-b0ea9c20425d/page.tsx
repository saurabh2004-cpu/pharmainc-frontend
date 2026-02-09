"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building, Upload, Loader2, LogIn, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { login, createInstitution, updateInstitution, register, getInstitution } from '@/lib/api';
import axios from 'axios';

// Create admin-specific API instance
const createAdminApiInstance = () => {
  const instance = axios.create({ 
    baseURL: process.env.NEXT_PUBLIC_API_INSTITUTE!
  });
  
  instance.interceptors.request.use(
    (config) => {
      // Use debug admin token from localStorage instead of cookies
      if (typeof window !== 'undefined') {
        const tokens = Object.keys(localStorage)
          .filter(key => key.startsWith('debug_admin_token_'))
          .map(key => localStorage.getItem(key))
          .filter(Boolean);
        
        const token = tokens[0]; // Use the first available admin token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  return instance;
};

// Admin API functions
const adminApi = createAdminApiInstance();

const adminLogin = async (email: string, password: string) => {
  const response = await login({ email, password, type: 'institution' });
  localStorage.setItem(`debug_admin_token_${email}`, response.token);
  return response;
};

const adminGetInstitution = async (): Promise<any> => {
  const response = await adminApi.get('/private/institution');
  return response.data;
};

const adminUpdateInstitution = async (data: any): Promise<any> => {
  const response = await adminApi.put('/private/institution', data);
  return response.data;
};

const adminCreateInstitution = async (data: any): Promise<any> => {
  const response = await adminApi.post('/private/institution', data);
  return response.data;
};

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label: string;
  userId?: string;
  isInstitute?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImage, 
  label, 
  userId, 
  isInstitute = false 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Use the same upload service as profile
      const formData = new FormData();
      formData.append('file', file);
      
      if (isInstitute && userId) {
        formData.append('instituteId', userId);
      } else if (userId) {
        formData.append('userId', userId);
      }

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const result = await response.json();
      onImageUploaded(result.url);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {currentImage ? (
          <div className="space-y-4">
            <img
              src={currentImage}
              alt="Uploaded"
              className="mx-auto max-h-32 rounded-lg object-cover"
            />
            <Badge variant="secondary">Image uploaded</Badge>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="mt-4"
        />
        {isUploading && (
          <div className="flex items-center justify-center mt-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        )}
        {uploadError && (
          <p className="text-sm text-red-600 mt-2">{uploadError}</p>
        )}
      </div>
    </div>
  );
};

const AdminInstituteOnboardingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [institutionData, setInstitutionData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form data for both signin and signup
  const [formData, setFormData] = useState({
    // Admin/Auth details
    email: '',
    password: '',
    
    // Institution details (from API schema)
    name: '',
    location: '',
    type: '',
    verified: false,
    employees_count: '',
    area_of_expertise: '',
    profile_picture: '',
    contact_email: '',
    contact_number: '',
    bio: '',
    about: '',
  });

  const [loading, setLoading] = useState(false);
  const [currentSpecialization, setCurrentSpecialization] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);

  useEffect(() => {
    // Check if already authenticated
    const tokens = Object.keys(localStorage).filter(key => key.startsWith('debug_admin_token_'));
    if (tokens.length > 0) {
      setIsAuthenticated(true);
      loadInstitutionData();
    }
    
    // Check URL params for default mode
    const modeParam = searchParams?.get('mode');
    if (modeParam === 'signin' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [searchParams]);

  const loadInstitutionData = async () => {
    try {
      const data = await adminGetInstitution();
      setInstitutionData(data);
      setFormData(prev => ({
        ...prev,
        ...data,
        contact_email: data.contact_email || data.email || '',
      }));
      
      // Parse specializations from area_of_expertise
      if (data.area_of_expertise) {
        setSpecializations(data.area_of_expertise.split(', ').filter(Boolean));
      }
    } catch (error) {
      console.error('Failed to load institution data:', error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSpecialization = () => {
    if (currentSpecialization.trim() && !specializations.includes(currentSpecialization.trim())) {
      setSpecializations(prev => [...prev, currentSpecialization.trim()]);
      setCurrentSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations(prev => prev.filter(s => s !== spec));
  };

  const validateSignin = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.name.trim()) newErrors.name = 'Institution name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.type) newErrors.type = 'Institution type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignin = async () => {
    if (loading) return;
    
    setSuccessMessage('');
    setErrors({});

    if (!validateSignin()) return;

    setLoading(true);

    try {
      await adminLogin(formData.email, formData.password);
      setIsAuthenticated(true);
      await loadInstitutionData();
      setSuccessMessage('Signed in successfully!');
    } catch (error: any) {
      console.error('Signin error:', error);
      setErrors({ submit: error.message || 'Signin failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (loading) return;
    
    setSuccessMessage('');
    setErrors({});

    if (!validateSignup()) return;

    setLoading(true);

    try {
      // Register the admin user
      const status = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        type: 'institution',
      });

      if (status === 201) {
        // Login and get debug token
        await adminLogin(formData.email, formData.password);
        
        // Create institution
        const institutionResponse = await adminCreateInstitution({
          name: formData.name,
          location: formData.location,
          type: formData.type,
        });

        setInstitutionData(institutionResponse);
        setIsAuthenticated(true);
        setSuccessMessage('Institution created successfully!');
      } else {
        setErrors({ submit: 'Institution registration failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors({ submit: error.message || 'Institution signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInstitution = async () => {
    if (loading) return;
    
    setLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const updateData = {
        name: formData.name,
        location: formData.location,
        type: formData.type,
        verified: formData.verified,
        employees_count: formData.employees_count,
        area_of_expertise: specializations.join(', '),
        profile_picture: formData.profile_picture,
        contact_email: formData.contact_email,
        contact_number: formData.contact_number,
        bio: formData.bio,
        about: formData.about,
      };
      
      const updatedInstitution = await adminUpdateInstitution(updateData);
      setInstitutionData(updatedInstitution);
      setSuccessMessage('Institution updated successfully!');
    } catch (error: any) {
      console.error('Update error:', error);
      setErrors({ submit: error.message || 'Failed to update institution.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all debug admin tokens
    Object.keys(localStorage)
      .filter(key => key.startsWith('debug_admin_token_'))
      .forEach(key => localStorage.removeItem(key));
    
    setIsAuthenticated(false);
    setInstitutionData(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      location: '',
      type: '',
      verified: false,
      employees_count: '',
      area_of_expertise: '',
      profile_picture: '',
      contact_email: '',
      contact_number: '',
      bio: '',
      about: '',
    });
    setSpecializations([]);
  };

  // Authentication Form Component
  const AuthForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Admin Institute {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(value: any) => setMode(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}
          
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={loading}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <Button onClick={handleSignin} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Institution Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={loading}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Institution Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="research-center">Research Center</SelectItem>
                    <SelectItem value="university">Medical University</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="nursing-home">Nursing Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signup">Email *</Label>
                <Input
                  id="email-signup"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="password-signup">Password *</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={loading}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            <Button onClick={handleSignup} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Institution...
                </>
              ) : (
                'Create Institution'
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-900">Admin Institute Panel</h2>
          </div>
          <p className="text-blue-800 mb-4">
            {isAuthenticated 
              ? "Manage your institution's profile and settings." 
              : "Sign in to an existing institution or create a new one."
            }
          </p>
        </CardContent>
      </Card>

      {/* Show appropriate form based on authentication */}
      {isAuthenticated ? (
        // Institution Management Form
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Manage Institution
              </CardTitle>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{successMessage}</p>
              </div>
            )}
            
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution-name">Institution Name</Label>
                <Input
                  id="institution-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution-location">Location</Label>
                <Input
                  id="institution-location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution-type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="research-center">Research Center</SelectItem>
                    <SelectItem value="university">Medical University</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="nursing-home">Nursing Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees-count">Number of Employees</Label>
                <Input
                  id="employees-count"
                  value={formData.employees_count}
                  onChange={(e) => handleInputChange('employees_count', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-number">Contact Number</Label>
                <Input
                  id="contact-number"
                  value={formData.contact_number}
                  onChange={(e) => handleInputChange('contact_number', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={loading}
                  rows={3}
                  placeholder="Brief description of the institution"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  disabled={loading}
                  rows={4}
                  placeholder="Detailed information about the institution"
                />
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Specializations</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add specialization"
                    value={currentSpecialization}
                    onChange={(e) => setCurrentSpecialization(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
                    disabled={loading}
                  />
                  <Button type="button" onClick={addSpecialization} disabled={loading}>
                    Add
                  </Button>
                </div>
                {specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="cursor-pointer" onClick={() => removeSpecialization(spec)}>
                        {spec} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Institution Logo</h3>
              <ImageUpload
                label="Profile Picture"
                currentImage={formData.profile_picture}
                onImageUploaded={(url) => handleInputChange('profile_picture', url)}
                userId={institutionData?.id}
                isInstitute={true}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleUpdateInstitution} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Institution'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Authentication Form
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Admin Institute {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(value: any) => setMode(value)} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{successMessage}</p>
                </div>
              )}
              
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{errors.submit}</p>
                </div>
              )}

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={loading}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <Button onClick={handleSignin} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Institution Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={loading}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={loading}
                      className={errors.location ? 'border-red-500' : ''}
                    />
                    {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Institution Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select institution type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="research-center">Research Center</SelectItem>
                        <SelectItem value="university">Medical University</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="laboratory">Laboratory</SelectItem>
                        <SelectItem value="nursing-home">Nursing Home</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email *</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={loading}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="password-signup">Password *</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={loading}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>
                </div>

                <Button onClick={handleSignup} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating Institution...
                    </>
                  ) : (
                    'Create Institution'
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Wrapper component with Suspense boundary
const AdminInstituteOnboardingPageWrapper = () => {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900">Loading Admin Panel...</h2>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Please wait while we load the admin interface.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AdminInstituteOnboardingPage />
    </Suspense>
  );
};

export default AdminInstituteOnboardingPageWrapper;