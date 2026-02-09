"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobPostingStore } from '@/store/jobPostingStore';
import { getJob, updateJob, createJob } from '@/lib/api/services/job';
import { JobUpdateParams } from '@/lib/api/types';

import { Button } from "@/components/ui/button";
import healthcareRoles from "@/lib/constants/healthcareRoles.json";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Briefcase,
  DollarSign,
  FileText,
  Phone,
  Mail,
  User,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsUpDown,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, name: 'Job Information', description: 'Basic details about the position', icon: Briefcase },
  { id: 2, name: 'Job Description', description: 'Detailed requirements and responsibilities', icon: FileText },
  { id: 3, name: 'Perks & Benefits', description: 'Salary and contact information', icon: DollarSign },
];

const jobTypes = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Temporary", label: "Temporary" },
];

const workLocations = [
  { value: "On-site", label: "On-site" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
];

const experienceLevels = [
  { value: "Entry Level", label: "Entry Level" },
  { value: "Mid Level", label: "Mid Level" },
  { value: "Senior Level", label: "Senior Level" },
  { value: "Expert Level", label: "Expert Level" },
];

const currencies = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];

const roleOptions = [
  { value: "DOCTOR", label: "Doctor" },
  // { value: "NURSE", label: "Nurse" },
  { value: "STUDENT", label: "Student" },
  { value: "OTHER", label: "Other" },
];

const rolesData = healthcareRoles as Record<string, Record<string, string[]>>;

const skillOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "React", label: "React" },
  { value: "Node.js", label: "Node.js" },
  { value: "Communication", label: "Communication" },
  { value: "Leadership", label: "Leadership" },
  { value: "Medical Coding", label: "Medical Coding" },
  { value: "Patient Care", label: "Patient Care" },
  { value: "Surgery", label: "Surgery" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Radiology", label: "Radiology" },
  { value: "Anesthesiology", label: "Anesthesiology" },
  { value: "Emergency Medicine", label: "Emergency Medicine" },
];

const jobPostingSchema = z.object({
  // Required fields
  title: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  fullDescription: z.string().min(50, { message: "Description must be at least 50 characters." }),
  jobType: z.string().min(1, { message: "Please select a job type." }),
  workLocation: z.string().min(1, { message: "Please select a work location." }),
  experienceLevel: z.string().min(1, { message: "Please select an experience level." }),
  requirements: z.string().min(20, { message: "Requirements must be at least 20 characters." }),
  salaryMin: z.coerce.number().min(0, { message: "Minimum salary must be a positive number." }),
  salaryMax: z.coerce.number().min(0, { message: "Maximum salary must be a positive number." }),

  // New Fields
  role: z.string().min(1, { message: "Please select a role." }),
  skills: z.array(z.string()).min(1, { message: "Select at least 1 skill." }),
  speciality: z.string().min(1, { message: "Please enter a speciality." }),
  subSpeciality: z.string().min(1, { message: "Please enter a sub-speciality." }),
  city: z.string().optional(),
  country: z.string().optional(),

  // Optional fields
  shortDescription: z.string().max(200).default(""),
  salaryCurrency: z.string().default("INR"),
  applicationDeadline: z.string().default(""),
  contactEmail: z.string().email({ message: "Please enter a valid email." }).or(z.literal("")).default(""),
  contactPhone: z.string().default(""),
  contactPerson: z.string().default(""),
  additionalInfo: z.string().default(""),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["salaryMax"],
}).superRefine((data, ctx) => {
  if ((data.workLocation === "On-site" || data.workLocation === "Hybrid") && !data.city) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "City is required for On-site or Hybrid roles",
      path: ["city"],
    });
  }
  if ((data.workLocation === "On-site" || data.workLocation === "Hybrid") && !data.country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Country is required for On-site or Hybrid roles",
      path: ["country"],
    });
  }
});

type JobPostingFormValues = z.infer<typeof jobPostingSchema>;

/**
 * Helper function to extract user-friendly error messages from API error responses
 * Priority order:
 * 1. response.data.message (highest priority)
 * 2. response.data.error
 * 3. error.message (network/axios errors)
 * 4. Fallback: "Something went wrong. Please try again."
 */
const parseApiError = (error: any): string => {
  // Priority 1: Check for backend response with message field
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Priority 2: Check for backend response with error field
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Priority 3: Check for axios/network error message
  if (error.message) {
    // Provide user-friendly message for network errors
    if (error.message === 'Network Error') {
      return 'Network error. Please check your connection and try again.';
    }
    return error.message;
  }

  // Priority 4: Fallback
  return 'Something went wrong. Please try again.';
};

interface JobPostingFormProps {
  jobId?: string;
}


const JobPostingForm = ({ jobId }: JobPostingFormProps) => {
  const router = useRouter();
  const { currentDraft, setDraft, submitJob, clearDraft, isSubmitting: storeIsSubmitting, setEditMode } = useJobPostingStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [openSpeciality, setOpenSpeciality] = useState(false);
  const [openSubSpeciality, setOpenSubSpeciality] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false); // Guard for draft restoration
  // State for dynamic location fields
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
        const data = await response.json();
        if (!data.error) {
          const countryOptions = data.data.map((c: any) => ({
            label: c.name,
            value: c.name,
          }));
          setCountries(countryOptions);
        }
      } catch (error) {
        toast.error("Failed to load countries");
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities when country changes
  // We'll handle this logic inside the render mainly or via a specific effect if needed.
  // Ideally, when country changes, we fetch cities.





  const isSubmitting = storeIsSubmitting || isLoading;
  const isEditMode = !!jobId;

  // Calculate default deadline (30 days from today)
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setDate(today.getDate() + 30);
  const defaultDeadline = nextMonth.toISOString().split('T')[0];

  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema) as any,
    defaultValues: {
      title: "",
      fullDescription: "",
      jobType: "",
      workLocation: "",
      experienceLevel: "",
      requirements: "",
      salaryMin: 0,
      salaryMax: 0,
      shortDescription: "",
      salaryCurrency: "INR",
      applicationDeadline: defaultDeadline,
      contactEmail: "",
      contactPhone: "",
      contactPerson: "",
      additionalInfo: "",
      role: "",
      skills: [],
      speciality: "",
      subSpeciality: "",
      city: "",
      country: "",
    },
  });

  const handleCountryChange = async (countryName: string) => {
    form.setValue("country", countryName);
    form.setValue("city", ""); // Reset city
    setCities([]);

    if (!countryName) return;

    setIsLoadingCities(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: countryName }),
      });
      const data = await response.json();
      if (!data.error) {
        const cityOptions = data.data.map((c: string) => ({
          label: c,
          value: c,
        }));
        setCities(cityOptions);
      } else {
        // Handle case where no cities are found or API error
        setCities([]);
      }
    } catch (error) {
      toast.error("Failed to load cities");
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Effect to load cities if country is already selected (e.g. edit mode or draft)
  useEffect(() => {
    const currentCountry = form.getValues("country");
    if (currentCountry && cities.length === 0 && !isLoadingCities) {
      handleCountryChange(currentCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("country")]); // Careful with deps here

  // Fetch job details if in Edit Mode
  // Fetch job details if in Edit Mode OR load draft for new job
  useEffect(() => {
    const fetchJobDetails = async () => {
      // CASE 1: creating a new job (no jobId)
      if (!jobId) {
        // Check for client-side draft first
        const savedDraft = localStorage.getItem('job-draft-new');
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            if (parsed && parsed.formData) {
              setIsRestoring(true);
              // Restore form data
              form.reset(parsed.formData);

              // Restore step if available
              if (parsed.currentStep) {
                setCurrentStep(parsed.currentStep);
              }

              toast.info("Restored saved draft");

              // Allow effects to run after a short delay
              setTimeout(() => setIsRestoring(false), 500);
            }
          } catch (e) {
            console.error("Failed to parse draft", e);
          }
        }
        // Fallback to store draft if needed (optional, keeping existing logic for safety if desired, but localStorage is primary now)
        else if (currentDraft && !currentDraft.id) {
          form.reset({
            title: currentDraft.title || "",
            fullDescription: currentDraft.fullDescription || "",
            jobType: currentDraft.jobType || "",
            workLocation: currentDraft.workLocation || "",
            experienceLevel: currentDraft.experienceLevel || "",
            requirements: currentDraft.requirements || "",
            salaryMin: currentDraft.salaryMin || 0,
            salaryMax: currentDraft.salaryMax || 0,
            shortDescription: currentDraft.shortDescription || "",
            salaryCurrency: currentDraft.salaryCurrency || "INR",
            applicationDeadline: currentDraft.applicationDeadline || defaultDeadline,
            contactEmail: currentDraft.contactEmail || "",
            contactPhone: currentDraft.contactPhone || "",
            contactPerson: currentDraft.contactPerson || "",
            additionalInfo: currentDraft.additionalInfo || "",
            role: currentDraft.role || "",
            skills: (currentDraft.skills || []) as string[],
            speciality: currentDraft.speciality || "",
            subSpeciality: currentDraft.subSpeciality || "",

            city: currentDraft.city || "",
            country: currentDraft.country || "",
          });
        }
        return;
      }

      // CASE 2: Editing existing job
      setIsLoading(true);
      try {
        const { job } = await getJob(jobId);

        // Map backend Date string to YYYY-MM-DD for input[type="date"]
        const formattedDate = job.applicationDeadline
          ? new Date(job.applicationDeadline).toISOString().split('T')[0]
          : "";

        const formData: JobPostingFormValues = {
          title: job.title,
          fullDescription: job.fullDescription,

          jobType: job.jobType,
          workLocation: job.workLocation,
          experienceLevel: job.experienceLevel,
          requirements: job.requirements,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          shortDescription: job.shortDescription || "",
          salaryCurrency: job.salaryCurrency || "INR",
          applicationDeadline: formattedDate,
          contactEmail: job.contactEmail || "",
          contactPhone: job.contactPhone || "",
          contactPerson: job.contactPerson || "",
          additionalInfo: job.additionalInfo || "",
          role: job.role?.toUpperCase() || "",
          skills: job.skills || [],
          speciality: job.speciality || "",
          subSpeciality: job.subSpeciality || "",

          city: job.city || "",
          country: job.country || "",
        };

        // Check if there's a newer local draft for this specific job ID
        const editDraft = localStorage.getItem(`job-draft-${jobId}`);
        if (editDraft) {
          const parsed = JSON.parse(editDraft);
          // Optional: Ask user if they want to restore draft or use server data? 
          // unique key logic might be needed to compare timestamps. 
          // For now, we implicitly trust server data usually, but if user explicitly saved a draft locally while editing, 
          // maybe we should prioritize it? 
          // "Restored saved draft" behavior implies priority.
          if (parsed && parsed.lastSaved && new Date(parsed.lastSaved) > new Date(job.updated_at)) {
            setIsRestoring(true);
            // Local draft is newer than server data
            form.reset(parsed.formData);
            if (parsed.currentStep) setCurrentStep(parsed.currentStep);
            toast.info("Restored unsaved changes from draft");
            setIsLoading(false);
            setTimeout(() => setIsRestoring(false), 500);
            return;
          }
        }

        form.reset(formData);

        // Sync with store's edit mode
        setEditMode(jobId, {
          ...formData,
          skills: formData.skills,
        });

      } catch (error) {
        console.error("Failed to fetch job details:", error);
        toast.error("Failed to load job details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, form, setEditMode]); // Removed currentDraft from deps to avoid loop/reset on every keystroke

  // Watch for changes and update draft only if NOT loading initial data
  useEffect(() => {
    // We only want to sync to draft if we're not currently loading data
    if (isLoading) return;

    const subscription = form.watch((value) => {
      // Logic to prevent overwriting if form hasn't initialized could be added here
      // But standard setDraft merge is usually safe.
      setDraft({
        ...value,
        skills: value.skills ? (value.skills.filter(Boolean) as string[]) : undefined,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, setDraft, isLoading]);

  // Derived options for Speciality and SubSpeciality
  const selectedRole = form.watch("role");
  const selectedSpeciality = form.watch("speciality");

  const specialityOptions = selectedRole ? Object.keys(rolesData[selectedRole] || {}) : [];
  const subSpecialityOptions = (selectedRole && selectedSpeciality)
    ? (rolesData[selectedRole]?.[selectedSpeciality] || [])
    : [];

  // Reset child fields when parent changes
  useEffect(() => {
    // We need to be careful not to reset if we are just loading initial data
    // But since this effect runs on selectedRole change, it might run on load.
    // However, if we load data, we set value. If we change role, we want to reset.
    // To distinguish, we might check if the current value is valid for the new role?
    // Or just rely on the user inteaction. 
    // Ideally, we only reset if the current value is NOT in the new options.

    // Simple approach: if role changes and speciality is set, reset speciality.
    // But we need to avoid resetting immediately after form.reset() calls.
    // isLoading handles the initial load phase? 
    if (isLoading || isRestoring) return; // Don't reset during loading or restoring

    const currentSpeciality = form.getValues("speciality");
    if (currentSpeciality && !specialityOptions.includes(currentSpeciality)) {
      form.setValue("speciality", "");
      form.clearErrors("speciality");
      form.setValue("subSpeciality", "");
      form.clearErrors("subSpeciality");
    }
  }, [selectedRole, form, specialityOptions, isLoading]);

  useEffect(() => {
    if (isLoading || isRestoring) return;

    const currentSubSpeciality = form.getValues("subSpeciality");
    if (currentSubSpeciality && !subSpecialityOptions.includes(currentSubSpeciality)) {
      form.setValue("subSpeciality", "");
      form.clearErrors("subSpeciality");
    }
  }, [selectedSpeciality, form, subSpecialityOptions, isLoading]);

  // Effect to handle dynamic deadline logic
  useEffect(() => {
    if (isLoading) return;

    const currentRole = form.getValues("role");
    const isDoctor = currentRole?.toUpperCase() === "DOCTOR";
    const currentDeadline = form.getValues("applicationDeadline");

    // Calculate dates
    const today = new Date();
    const date30 = new Date(today); date30.setDate(today.getDate() + 30);
    const date30Str = date30.toISOString().split('T')[0];

    // Logic:
    // 1. If NOT Doctor, ALWAYS force 30 days.
    // 2. If Doctor, allow existing valid choice (30 or 45). If invalid/empty, default to 30.

    if (!isDoctor) {
      if (currentDeadline !== date30Str) {
        form.setValue("applicationDeadline", date30Str);
      }
    } else {
      // It is Doctor
      // Check if current deadline is approx 45 days.
      // If NOT 45 days (date45) AND NOT 30 days (date30), default to 30.
      const date45 = new Date(today); date45.setDate(today.getDate() + 45);
      const date45Str = date45.toISOString().split('T')[0];

      if (currentDeadline !== date30Str && currentDeadline !== date45Str) {
        // If it's a pre-filled edit mode date that DOESN'T match our strict rules, 
        // strictly speaking requirement says "Options depend strictly on the selected jobType / role" 
        // and "Handle... Edit mode with prefilled values".
        // If the prefilled value is "weird" (e.g. 12 days left), we might want to preserve it OR reset it.
        // User req: "All other roles always resolve to 30 days". "Only Doctor roles can see and choose 30 / 45 days".
        // Safe bet: Snap to nearest option or default to 30 if it deviates wildly?
        // Requirement 2: "Provide exactly two selectable options: 30 Days, 45 Days".
        // Requirement 6: "Edit mode with prefilled values".

        // Let's implement logic: 
        // If existing deadline roughly matches 45 (e.g. within a day due to timezone?), keep it as 45 option?
        // Better: Just set to 30 if it's not strictly 45.
        // But wait, if they are editing a job posted 20 days ago, the deadline stored is probably passed or close.
        // "applicationDeadline = today’s date + selected number of days"
        // This suggests we are resetting the deadline *relative to today* whenever we interact.
        // This is a "Posting" form. In edit mode, are we "re-posting" or just editing text?
        // Usually modifying a job posting might not extend the deadline unless explicitly requested.
        // However, the prompt says "Enhance the Application Deadline behavior... The deadline date is calculated automatically based on today’s date".
        // "Handle... Edit mode with prefilled values"

        // I will adhere to: If role is Doctor, and deadline is set, check if it matches 45 logic.
        // If not, default to 30 logic.
        // Actually, for simplicity and meeting "Predictable" requirement:
        // If we switch to Doctor, we set to 30 (unless we manually picked 45).
        // If we are already Doctor, we leave it be IF it matches one of our options relative to *creation*? 
        // No, the prompt explicitly says "applicationDeadline = today’s date + selected number of days".
        // This implies resetting the clock.
        // I will assume for now we forcibly update to Today+30 unless they pick 45.

        form.setValue("applicationDeadline", date30Str);
      }
    }
  }, [form.watch("role"), isLoading]); // Watch role changes

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof JobPostingFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['title', 'jobType', 'workLocation', 'experienceLevel', 'role', 'speciality', 'subSpeciality', 'skills', 'city', 'country', 'shortDescription'];
        break;
      case 2:
        fieldsToValidate = ['fullDescription', 'requirements', 'additionalInfo'];
        break;
      case 3:
        fieldsToValidate = ['salaryMin', 'salaryMax', 'salaryCurrency', 'applicationDeadline', 'contactEmail', 'contactPhone', 'contactPerson'];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    form.handleSubmit(onSubmit)();
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  async function onSubmit(data: JobPostingFormValues) {
    setIsLoading(true);
    try {
      if (isEditMode && jobId) {
        // UPDATE EXISTING JOB
        const updatePayload: JobUpdateParams = {
          // Use 'any' cast to send the FULL modern payload, assuming backend handles it like Create.
          ...(data as any),
          role: data.role ? (data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase()) : "Other",
          jobType: data.jobType,
          speciality: data.speciality || null,
          subSpeciality: data.subSpeciality || null,
          fullDescription: data.fullDescription,
          applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline).toISOString() : undefined,
        };

        await updateJob(jobId, updatePayload);
        toast.success("Job updated successfully!");
      } else {
        // CREATE NEW JOB
        // Update store with final form data, applying the same mapping fix
        // Update store with final form data
        setDraft({
          ...data,
          role: data.role ? (data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase()) : "Other",
          jobType: data.jobType,
        });

        const res = await submitJob(); // This interacts with the store's internal submit logic (create)
        console.log("new job create response", res)
        toast.success("Job posted successfully!");
      }

      form.reset({
        title: "",
        fullDescription: "",
        jobType: "",
        workLocation: "",
        experienceLevel: "",
        requirements: "",
        salaryMin: 0,
        salaryMax: 0,
        shortDescription: "",
        salaryCurrency: "INR",
        applicationDeadline: "",
        contactEmail: "",
        contactPhone: "",
        contactPerson: "",
        additionalInfo: "",
        role: "",
        skills: [],
        city: "",
      });

      clearDraft(); // Clear store draft

      // Clear client-side draft
      if (isEditMode && jobId) {
        localStorage.removeItem(`job-draft-${jobId}`);
      } else {
        localStorage.removeItem('job-draft-new');
      }

      router.push('/dashboard');
      setCurrentStep(1);

    } catch (error: any) {
      const errorMessage = parseApiError(error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'post'} job: ${errorMessage}`);
      console.error('Job submission error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveDraft = async () => {
    // Client-side only draft
    const formData = form.getValues();

    // Create a comprehensive draft object
    const draftData = {
      formData: {
        ...formData,
        // Ensure role is formatted correctly if needed, though raw form data is usually best for restoring
        role: formData.role,
        skills: formData.skills || [],
      },
      currentStep: currentStep,
      lastSaved: new Date().toISOString(),
    };

    // Key depends on whether we are editing an existing job or creating a new one
    // If editing, we use the jobId. If creating, we use a generic 'new' key.
    // Note: If multiple new jobs are being drafted, this simple 'new' key might overwrite.
    // However, for this scope, a single 'new' draft is standard behavior unless we generate IDs upfront.
    const storageKey = isEditMode && jobId ? `job-draft-${jobId}` : 'job-draft-new';

    try {
      localStorage.setItem(storageKey, JSON.stringify(draftData));
      toast.success("Draft saved locally");

      // Update store draft state if needed for UI consistency, but strictly relying on localStorage now
      setDraft(formData);

    } catch (error) {
      console.error("Failed to save draft locally:", error);
      toast.error("Failed to save draft locally. Storage might be full.");
    }
  };

  const handleDiscard = () => {
    clearDraft();
    if (isEditMode && jobId) {
      localStorage.removeItem(`job-draft-${jobId}`);
    } else {
      localStorage.removeItem('job-draft-new');
    }
    form.reset();
    setCurrentStep(1);
    toast.info("Draft discarded");
    router.back();
  };

  if (isLoading && isEditMode && !form.getValues("title")) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Job Posting" : "Create New Job Posting"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isEditMode ? "Update the details of your job posting" : "Complete all steps to post your job opening"}
        </CardDescription>

        {/* Progress Steps */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                        ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                        ${isCurrent ? 'bg-blue-600 border-blue-600 text-white' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4 mb-12">
                      <div
                        className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Job Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Row 1: Job Title, Job Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Job Title <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Cardiologist"
                            className="h-11 bg-gray-50 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Job Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Role, Speciality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => {
                      const jobType = form.watch("jobType");

                      const filteredRoles = roleOptions.filter(role => {
                        if (jobType === "Internship") {
                          return true;
                        } else {
                          return role.value !== "STUDENT";
                        }
                      });

                      return (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Role <span className="text-red-500">*</span>
                          </FormLabel>

                          <Select
                            disabled={isEditMode}
                            onValueChange={(val) => {
                              field.onChange(val);
                              // Explicitly reset children on manual change? 
                              // The useEffect handles it, but immediate feedback is nice.
                              form.setValue("speciality", "");
                              form.clearErrors("speciality");
                              form.setValue("subSpeciality", "");
                              form.clearErrors("subSpeciality");
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {filteredRoles.map((role) => (
                                <SelectItem
                                  key={role.value}
                                  value={role.value}
                                  className="cursor-pointer"
                                >
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="speciality"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-700 font-medium">
                          Speciality
                        </FormLabel>
                        <Popover open={openSpeciality} onOpenChange={setOpenSpeciality}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between h-11 bg-gray-50 border-gray-200 px-3 py-2",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!selectedRole || isLoading}
                              >
                                {field.value
                                  ? field.value
                                  : "Select speciality"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search speciality..." />
                              <CommandList>
                                <CommandGroup>
                                  {specialityOptions.map((option) => (
                                    <div
                                      key={option}
                                      className={cn(
                                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                      )}
                                      onClick={() => {
                                        field.onChange(option);
                                        form.setValue("subSpeciality", "");
                                        form.clearErrors("subSpeciality");
                                        setOpenSpeciality(false);
                                      }}
                                      onMouseDown={(e) => e.preventDefault()}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === option ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {option}
                                    </div>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Sub-Speciality, Work Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="subSpeciality"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-700 font-medium">
                          Sub-Speciality
                        </FormLabel>
                        <Popover open={openSubSpeciality} onOpenChange={setOpenSubSpeciality}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between h-11 bg-gray-50 border-gray-200 px-3 py-2",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!selectedSpeciality || isLoading}
                              >
                                {field.value
                                  ? field.value
                                  : "Select sub-speciality"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search sub-speciality..." />
                              <CommandList>
                                <CommandGroup>
                                  {subSpecialityOptions.map((option) => (
                                    <div
                                      key={option}
                                      className={cn(
                                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                      )}
                                      onClick={() => {
                                        field.onChange(option);
                                        setOpenSubSpeciality(false);
                                      }}
                                      onMouseDown={(e) => e.preventDefault()}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === option ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {option}
                                    </div>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Work Location <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select work location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workLocations.map((location) => (
                              <SelectItem key={location.value} value={location.value}>
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Conditional Country/City fields */}
                {(form.watch("workLocation") === "On-site" || form.watch("workLocation") === "Hybrid") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Country <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              handleCountryChange(value);
                              // Manually invoke form onChange as well if needed by controller, but we set it manually in handleCountryChange
                              // Actually better to refrain from manual setValue in handleCountryChange for the field itself if we use field.onChange
                              // Let's adjust: call field.onChange(value) then fetch cities.
                              field.onChange(value);
                            }}
                            value={field.value}
                            disabled={isLoadingCountries}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                <SelectValue placeholder={isLoadingCountries ? "Loading..." : "Select country"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            City <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!form.watch("country") || isLoadingCities}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                <SelectValue placeholder={isLoadingCities ? "Loading..." : "Select city"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.value} value={city.value}>
                                  {city.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Row 4: Experience Level, Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Experience Level <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => {
                      const selectedSkills: string[] = field.value ?? [];

                      const toggleSkill = (skill: string) => {
                        if (selectedSkills.includes(skill)) {
                          field.onChange(selectedSkills.filter((s) => s !== skill));
                        } else {
                          field.onChange([...selectedSkills, skill]);
                        }
                      };

                      return (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Skills <span className="text-red-500">*</span>
                          </FormLabel>

                          <FormControl>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between min-h-[44px] bg-gray-50 border-gray-200 px-3 py-2"
                                >
                                  <div className="flex flex-wrap gap-1 items-center text-left">
                                    {selectedSkills.length > 0 ? (
                                      selectedSkills.map((skill) => (
                                        <Badge
                                          key={skill}
                                          variant="secondary"
                                          className="flex items-center gap-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSkill(skill);
                                          }}
                                        >
                                          {skill}
                                          <X className="h-3 w-3 cursor-pointer hover:text-red-500" />
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Select skills...
                                      </span>
                                    )}
                                  </div>

                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-[400px] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search skills..." />
                                  <CommandList>
                                    {/* <CommandEmpty>No skill found.</CommandEmpty> */}

                                    <CommandGroup>
                                      {skillOptions.map((option) => {
                                        const isSelected = selectedSkills.includes(option.value);

                                        return (
                                          <div
                                            key={option.value}
                                            className={cn(
                                              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                              "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                            )}
                                            onClick={() => toggleSkill(option.value)}
                                            onMouseDown={(e) => e.preventDefault()}
                                          >
                                            <div className="flex items-center w-full">
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4 flex-shrink-0",
                                                  isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                              />
                                              <span className="flex-grow">{option.label}</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief summary of the position (max 200 characters)..."
                          className="min-h-[80px] bg-gray-50 border-gray-200"
                          maxLength={200}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value?.length || 0}/200 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Job Description */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <FormField
                  control={form.control}
                  name="fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Full Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role, responsibilities, and what makes this position unique..."
                          className="min-h-[200px] bg-gray-50 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify role, responsibilities, team structure, and growth opportunities.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Requirements <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List required qualifications, certifications, skills, and experience..."
                          className="min-h-[150px] bg-gray-50 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Required experience and qualifications for the position.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any other relevant details about the position..."
                          className="min-h-[100px] bg-gray-50 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Perks & Benefits */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="salaryCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Currency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Minimum Salary <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 500000"
                            className="h-11 bg-gray-50 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Maximum Salary <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 1000000"
                            className="h-11 bg-gray-50 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => {
                      // Determine if the selected role is Doctor (case-insensitive)
                      const role = form.watch("role");
                      const isDoctor = role?.toUpperCase() === "DOCTOR";

                      // Identify current selection duration (approximate)
                      // If date matches today+30 -> 30, today+45 -> 45
                      // This is a UI helper, the source of truth is the date string in the form
                      const today = new Date();
                      const scheduledDate = field.value ? new Date(field.value) : null;

                      // Calculate difference in days to determine current "mode"
                      // Default to 30 if no match or not set
                      let currentDuration = 30;
                      if (scheduledDate) {
                        const diffTime = Math.abs(scheduledDate.getTime() - today.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        // Allow some looseness (e.g. 29/30/31 due to time) or strict mode?
                        // Strict logic: if it's > 40 it's likely 45.
                        if (diffDays > 40) currentDuration = 45;
                      }

                      const handleDurationChange = (days: number) => {
                        const targetDate = new Date();
                        targetDate.setDate(targetDate.getDate() + days);
                        field.onChange(targetDate.toISOString().split('T')[0]);
                      };

                      // Reactively ensure non-doctors are locked to 30 days
                      // This useEffect-like logic inside render is generally bad practice,
                      // but we are adhering to "Modify only JobPostingFormStepWise.tsx" and "Derive logic".
                      // Better to put this in a useEffect in the main component body, but let's see if we can do it here?
                      // No, render side-effects are dangerous. We will move the logic to a useEffect in the component body.
                      // For now, this render block just handles the UI.

                      return (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Application Deadline
                          </FormLabel>
                          <FormControl>
                            {isDoctor ? (
                              <Select
                                value={currentDuration.toString()}
                                onValueChange={(val) => handleDurationChange(parseInt(val))}
                              >
                                <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="30">30 Days ({(() => {
                                    const d = new Date(); d.setDate(d.getDate() + 30); return d.toLocaleDateString();
                                  })()})</SelectItem>
                                  <SelectItem value="45">45 Days ({(() => {
                                    const d = new Date(); d.setDate(d.getDate() + 45); return d.toLocaleDateString();
                                  })()})</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="relative">
                                <Input
                                  value={`30 Days (${(() => {
                                    const d = new Date(); d.setDate(d.getDate() + 30); return d.toLocaleDateString();
                                  })()})`}
                                  disabled
                                  className="h-11 bg-gray-100 border-gray-200 text-gray-500"
                                />
                                {/* Hidden actual input to ensure form registration if needed, though react-hook-form handles it via 'field' */}
                                <input type="hidden" {...field} />
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Contact Person
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Dr. John Smith"
                            className="h-11 bg-gray-50 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="hr@hospital.com"
                            className="h-11 bg-gray-50 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Contact Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="h-11 bg-gray-50 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscard}
                disabled={isSubmitting}
                className="px-6"
              >
                Discard
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  {isLoading ? "Saving..." : "Save as Draft"}
                </Button>

                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < STEPS.length && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}

                {currentStep === STEPS.length && (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Job" : "Create Job")}
                    <Check className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent >
    </Card >
  );
};

export default JobPostingForm;
