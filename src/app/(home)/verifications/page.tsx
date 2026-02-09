"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const verificationSchema = z.object({
  fullLegalName: z.string().min(2, "Full legal name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  governmentId: z.any().refine((file) => file && file.length > 0, "Government-issued photo ID is required"),
  authorizationConsent: z.string().refine(val => val === "yes", "You must authorize PharmInc to verify your information"),
  
  primaryEmail: z.string().email("Please enter a valid email address"),
  mobilePhone: z.string().min(10, "Phone number must be at least 10 digits"),
  currentAddress: z.string().min(10, "Current residential address is required"),
  
  professionalTitle: z.string().min(1, "Professional title is required"),
  primarySpecialty: z.string().min(2, "Primary specialty is required"),
  medicalLicenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  
  basicDegree: z.string().min(2, "Basic medical/professional degree is required"),
  university: z.string().min(2, "University/Institution name is required"),
  yearOfGraduation: z.string().min(4, "Year of graduation is required").max(4, "Year must be 4 digits"),
  degreeCertificate: z.any().optional(),
  postgraduateQualification: z.string().optional(),
  postgraduateInstitution: z.string().optional(),
  postgraduateCertificate: z.any().optional(),
  
  // Current Practice
  currentEmployer: z.string().optional(),
  designation: z.string().optional(),
  practiceAddress: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  
  // Professional Standing
  licenseSuspended: z.string().min(1, "Please indicate if your license has been suspended"),
  suspensionDetails: z.string().optional(),
  
  // Declaration
  declaration: z.boolean().refine(val => val === true, "You must confirm the declaration"),
})

type VerificationFormData = z.infer<typeof verificationSchema>

const VerificationPage = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { currentUser, fetchCurrentUser, loading: userLoading } = useUserStore()

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      fullLegalName: "",
      dateOfBirth: "",
      governmentId: undefined,
      authorizationConsent: "",
      primaryEmail: "",
      mobilePhone: "",
      currentAddress: "",
      professionalTitle: "",
      primarySpecialty: "",
      medicalLicenseNumber: "",
      licenseExpiryDate: "",
      basicDegree: "",
      university: "",
      yearOfGraduation: "",
      degreeCertificate: undefined,
      postgraduateQualification: "",
      postgraduateInstitution: "",
      postgraduateCertificate: undefined,
      currentEmployer: "",
      designation: "",
      practiceAddress: "",
      yearsOfExperience: "",
      licenseSuspended: "",
      suspensionDetails: "",
      declaration: false,
    },
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      
      if (token) {
        setIsAuthenticated(true)
        if (!currentUser && !userLoading) {
          await fetchCurrentUser()
        }
      } else {
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [currentUser, fetchCurrentUser, userLoading])

  const onSubmit = async (data: VerificationFormData) => {
    try {
      console.log("Verification form data:", data)
      // TODO: Implement API call to submit verification data
      alert("Verification request submitted successfully!")
      form.reset()
    } catch (error) {
      console.error("Error submitting verification:", error)
      alert("Failed to submit verification request. Please try again.")
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Verification</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Verification</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Please log in to access verification.</div>
        </div>
      </div>
    )
  }

  const currentYear = new Date().getFullYear()
  const yearOptions: string[] = []
  for (let year = currentYear; year >= 1950; year--) {
    yearOptions.push(year.toString())
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Professional Verification</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Professional Verification Request
              </CardTitle>
              <CardDescription className="text-center">
                Please complete all required fields (*) to verify your professional credentials. 
                This information will be used to verify your identity and professional qualifications.
              </CardDescription>
            </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      
                      {/* SECTION 1: Personal Information */}
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        </div>

                        {/* Full Legal Name */}
                        <FormField
                          control={form.control}
                          name="fullLegalName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Legal Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full legal name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Date of Birth */}
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Government-Issued Photo ID */}
                        <FormField
                          control={form.control}
                          name="governmentId"
                          render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                              <FormLabel>Government-Issued Photo ID *</FormLabel>
                              <FormDescription>
                                Please upload a clear copy of your Passport, Driver's License, or other government-issued photo ID
                              </FormDescription>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...field}
                                    className="cursor-pointer"
                                  />
                                  <Upload className="h-5 w-5 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Upload 1 supported file. Max 10 MB.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Authorization Consent */}
                        <FormField
                          control={form.control}
                          name="authorizationConsent"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>
                                I hereby authorize PharmInc to verify the information provided in this application, 
                                which may include contacting educational institutions, licensing bodies, and professional references *
                              </FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="consent-yes"
                                      value="yes"
                                      checked={field.value === "yes"}
                                      onChange={() => field.onChange("yes")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="consent-yes" className="font-normal cursor-pointer">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="consent-no"
                                      value="no"
                                      checked={field.value === "no"}
                                      onChange={() => field.onChange("no")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="consent-no" className="font-normal cursor-pointer">No</Label>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* SECTION 2: Contact Information */}
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                        </div>

                        {/* Primary Email Address */}
                        <FormField
                          control={form.control}
                          name="primaryEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Mobile Phone Number */}
                        <FormField
                          control={form.control}
                          name="mobilePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Phone Number *</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Current Residential Address */}
                        <FormField
                          control={form.control}
                          name="currentAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Residential Address *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your complete residential address"
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* SECTION 3: Professional Information */}
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                        </div>

                        {/* Professional Title */}
                        <FormField
                          control={form.control}
                          name="professionalTitle"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Professional Title *</FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="title-doctor"
                                      value="doctor"
                                      checked={field.value === "doctor"}
                                      onChange={() => field.onChange("doctor")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="title-doctor" className="font-normal cursor-pointer">Doctor</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="title-nurse"
                                      value="nurse"
                                      checked={field.value === "nurse"}
                                      onChange={() => field.onChange("nurse")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="title-nurse" className="font-normal cursor-pointer">Nurse</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="title-dentist"
                                      value="dentist"
                                      checked={field.value === "dentist"}
                                      onChange={() => field.onChange("dentist")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="title-dentist" className="font-normal cursor-pointer">Dentist</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="title-allied"
                                      value="allied"
                                      checked={field.value === "allied"}
                                      onChange={() => field.onChange("allied")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="title-allied" className="font-normal cursor-pointer">Allied Healthcare Professional</Label>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Primary Specialty */}
                        <FormField
                          control={form.control}
                          name="primarySpecialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Specialty *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Cardiology, Pediatrics, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Medical/Professional License Number */}
                        <FormField
                          control={form.control}
                          name="medicalLicenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medical/Professional License Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your license number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* License Expiry Date */}
                        <FormField
                          control={form.control}
                          name="licenseExpiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>License Expiry Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* SECTION 4: Educational Background */}
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Educational Background</h3>
                        </div>

                        {/* Basic Medical/Professional Degree */}
                        <FormField
                          control={form.control}
                          name="basicDegree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Basic Medical/Professional Degree *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., MBBS, MD, BSN, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* University / Institution */}
                        <FormField
                          control={form.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University / Institution *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the name of your university" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Year of Graduation */}
                        <FormField
                          control={form.control}
                          name="yearOfGraduation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year of Graduation *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year of graduation" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {yearOptions.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Copy of Degree Certificate */}
                        <FormField
                          control={form.control}
                          name="degreeCertificate"
                          render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                              <FormLabel>Copy of Degree Certificate</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...field}
                                    className="cursor-pointer"
                                  />
                                  <Upload className="h-5 w-5 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Upload 1 supported file. Max 10 MB.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Postgraduate Qualification */}
                        <FormField
                          control={form.control}
                          name="postgraduateQualification"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postgraduate Qualification (if applicable)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., MS, DNB, PhD, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Institution (Postgraduate) */}
                        <FormField
                          control={form.control}
                          name="postgraduateInstitution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution (Postgraduate)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter postgraduate institution name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Copy of Postgraduate Certificate */}
                        <FormField
                          control={form.control}
                          name="postgraduateCertificate"
                          render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                              <FormLabel>Copy of Postgraduate Certificate (if applicable)</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...field}
                                    className="cursor-pointer"
                                  />
                                  <Upload className="h-5 w-5 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Upload 1 supported file. Max 10 MB.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* SECTION 5: Current Practice */}
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Current Practice</h3>
                        </div>

                        {/* Current Place of Practice / Employer */}
                        <FormField
                          control={form.control}
                          name="currentEmployer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Place of Practice / Employer</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your current employer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Designation / Role */}
                        <FormField
                          control={form.control}
                          name="designation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Designation / Role</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Senior Consultant, Staff Nurse, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Practice Address */}
                        <FormField
                          control={form.control}
                          name="practiceAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Practice Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your practice/workplace address"
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Years of Experience */}
                        <FormField
                          control={form.control}
                          name="yearsOfExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" placeholder="Enter years of experience" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* SECTION 6: Professional Standing */}
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Professional Standing</h3>
                        </div>

                        {/* License Suspension */}
                        <FormField
                          control={form.control}
                          name="licenseSuspended"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>
                                Have you ever had your professional license or registration suspended, revoked, or restricted?
                              </FormLabel>
                              <FormControl>
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="suspended-yes"
                                      value="yes"
                                      checked={field.value === "yes"}
                                      onChange={() => field.onChange("yes")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="suspended-yes" className="font-normal cursor-pointer">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="suspended-no"
                                      value="no"
                                      checked={field.value === "no"}
                                      onChange={() => field.onChange("no")}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor="suspended-no" className="font-normal cursor-pointer">No</Label>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Suspension Details (conditional) */}
                        {form.watch("licenseSuspended") === "yes" && (
                          <FormField
                            control={form.control}
                            name="suspensionDetails"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>If "Yes," please provide details.</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Please provide details about the suspension, revocation, or restriction"
                                    className="resize-none"
                                    rows={4}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* SECTION 7: Declaration */}
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Declaration</h3>
                        </div>

                        {/* Declaration Checkbox */}
                        <FormField
                          control={form.control}
                          name="declaration"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I hereby declare that all the information provided in this form is true, correct, 
                                  and complete to the best of my knowledge. *
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full"
                          size="lg"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? "Submitting..." : "Submit Verification Request"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    export default VerificationPage