"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useEntityStore } from "@/store/entityStore";
import { submitVerification, getVerificationByUserId, fetchCountries as fetchCountriesService, fetchCitiesByCountry, LocationOption, countryCodes } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EntityType, User } from "@/lib/api/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useEffect } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
// Schema definition based on Prisma model
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// Schema definition
const verificationSchema = z.object({
    // Section 1: Personal Information
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    governMentId: z.any().refine((files) => files?.length > 0, "Government ID is required"),
    authorizeToVerify: z.boolean().refine((val) => val === true, "You must authorize verification"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone number is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),

    // Section 2: Professional Information
    professionalTitle: z.string().min(1, "Professional title is required"),
    primarySpecialty: z.string().min(1, "Primary specialty is required"),
    licenseNumber: z.string().min(1, "License number is required"),
    licenseExpiryDate: z.string().min(1, "License expiry date is required"),
    isLicenceSuspended: z.boolean().default(false),

    licenceSuspensionReason: z.string().optional(),

    // Section 3: Education Information
    degree: z.string().min(1, "Degree is required"),
    university: z.string().min(1, "University is required"),
    yearOfGraduation: z.string().min(1, "Year of graduation is required"),
    degreeCertificate: z.any().refine((files) => files?.length > 0, "Degree certificate is required"),

    postGraduateDegree: z.string().optional(),
    postGraduateUniversity: z.string().optional(),
    postGraduateDegreeCertificate: z.any().optional(),

    // Section 4: Current Employment (Optional)
    currentEmployer: z.string().optional(),
    currentRole: z.string().optional(),
    practiceCountry: z.string().optional(),
    practiceCity: z.string().optional(),
    declaration: z.boolean().default(false),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

const verificationSchemaWithRefines = verificationSchema.refine((data) => {
    if (data.isLicenceSuspended && (!data.licenceSuspensionReason || data.licenceSuspensionReason.trim() === "")) {
        return false;
    }
    return true;
}, {
    message: "Suspension reason is required if license is suspended",
    path: ["licenceSuspensionReason"]
}).refine((data) => {
    if (data.postGraduateDegree && data.postGraduateDegree.trim() !== "") {
        if (!data.postGraduateUniversity || data.postGraduateUniversity.trim() === "") return false;
    }
    return true;
}, {
    message: "Postgraduate university is required",
    path: ["postGraduateUniversity"]
}).refine((data) => {
    if (data.postGraduateDegree && data.postGraduateDegree.trim() !== "") {
        if (!data.postGraduateDegreeCertificate || data.postGraduateDegreeCertificate.length === 0) return false;
    }
    return true;
}, {
    message: "Postgraduate certificate is required",
    path: ["postGraduateDegreeCertificate"]
});

interface UserVerificationFormProps {
    verificationStatus: string | null;
    setVerificationStatus: (status: string | null) => void;
}

export function UserVerificationForm({ verificationStatus, setVerificationStatus }: UserVerificationFormProps) {
    const router = useRouter();
    const { entity, entityType } = useEntityStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectionDetails, setRejectionDetails] = useState<any>(null);

    // Location states
    const [countries, setCountries] = useState<LocationOption[]>([]);
    const [cities, setCities] = useState<LocationOption[]>([]);
    const [practiceCities, setPracticeCities] = useState<LocationOption[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [isLoadingPracticeCities, setIsLoadingPracticeCities] = useState(false);

    const form = useForm<VerificationFormValues>({
        resolver: zodResolver(verificationSchemaWithRefines) as any,
        defaultValues: {
            firstName: (entity as User)?.firstName || "",
            lastName: (entity as User)?.lastName || "",
            email: (entity as User)?.email || "",
            authorizeToVerify: false,
            isLicenceSuspended: false,
            professionalTitle: "",
            primarySpecialty: "",
            licenseNumber: "",
            degree: "",
            university: "",
            country: (entity as User)?.country || "India",
            city: (entity as User)?.city || "",
            phone: "",
            governMentId: undefined,
            dob: "",
            licenseExpiryDate: "",
            yearOfGraduation: "",
            declaration: false,
            practiceCountry: "India",
            practiceCity: "",
        },
    });

    // Fetch countries on mount
    useEffect(() => {
        const loadCountries = async () => {
            setIsLoadingCountries(true);
            const data = await fetchCountriesService();
            setCountries(data);
            setIsLoadingCountries(false);
        };
        loadCountries();
    }, []);

    const fetchCities = React.useCallback(async (countryName: string, isPractice: boolean = false) => {
        if (!countryName) {
            if (isPractice) setPracticeCities([]);
            else setCities([]);
            return;
        }

        if (isPractice) setIsLoadingPracticeCities(true);
        else setIsLoadingCities(true);

        const data = await fetchCitiesByCountry(countryName);
        if (isPractice) setPracticeCities(data);
        else setCities(data);

        if (isPractice) setIsLoadingPracticeCities(false);
        else setIsLoadingCities(false);
    }, []);

    // Fetch cities for default country on mount
    useEffect(() => {
        const defaultCountry = form.getValues('country');
        if (defaultCountry) {
            fetchCities(defaultCountry);
        }
        const defaultPracticeCountry = form.getValues('practiceCountry');
        if (defaultPracticeCountry) {
            fetchCities(defaultPracticeCountry, true);
        }
    }, [fetchCities]);

    // Re-sync form values when entity loads
    useEffect(() => {
        if (entity && entityType === EntityType.USER) {
            const user = entity as User;
            const initialCountry = user.country || "India";
            const initialPhoneCode = countryCodes[initialCountry] || "";

            form.reset({
                ...form.getValues(),
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                country: initialCountry,
                city: user.city || "",
                phone: initialPhoneCode,
            });

            if (initialCountry) {
                fetchCities(initialCountry);
            }
        }
    }, [entity, entityType, form, fetchCities]);

    // Fetch rejection details if status is REJECTED
    useEffect(() => {
        const fetchRejectionDetails = async () => {
            if (verificationStatus === "REJECTED" && entity?.id && !rejectionDetails) {
                try {
                    const data = await getVerificationByUserId(entity.id);
                    if (data && data.status === "REJECTED" && data.rejection) {
                        setRejectionDetails(data.rejection);
                    }
                } catch (error) {
                    console.error("Failed to fetch rejection details:", error);
                }
            }
        };
        fetchRejectionDetails();
    }, [verificationStatus, entity?.id, rejectionDetails]);

    const onSubmit: SubmitHandler<VerificationFormValues> = async (values) => {
        if (!values.declaration) {
            toast.warning("Please declare that the provided information is accurate to proceed.");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            // Ensure all text/data fields are appended as strings FIRST
            const textFields = [
                "firstName", "lastName", "dob", "authorizeToVerify", "email", "phone",
                "country", "city", "professionalTitle", "primarySpecialty", "licenseNumber",
                "licenseExpiryDate", "degree", "university", "yearOfGraduation",
                "postGraduateDegree", "postGraduateUniversity", "currentEmployer",
                "currentRole", "practiceCountry", "practiceCity", "isLicenceSuspended",
                "licenceSuspensionReason"
            ];

            textFields.forEach((key) => {
                const val = (values as any)[key];
                if (val !== undefined && val !== null && val !== "") {
                    // Format specific types to strings for multipart stability
                    if (["dob", "licenseExpiryDate", "yearOfGraduation"].includes(key)) {
                        try {
                            const d = new Date(val);
                            formData.append(key, d.toISOString());
                        } catch {
                            formData.append(key, String(val));
                        }
                    } else {
                        formData.append(key, String(val));
                    }
                }
            });

            // Append files LAST
            if (values.governMentId?.[0]) {
                formData.append("governMentId", values.governMentId[0]);
            }
            if (values.degreeCertificate?.[0]) {
                formData.append("degreeCertificate", values.degreeCertificate[0]);
            }
            if (values.postGraduateDegreeCertificate?.[0]) {
                formData.append("postGraduateDegreeCertificate", values.postGraduateDegreeCertificate[0]);
            }

            await submitVerification(formData);
            toast.success("Verification application submitted successfully!");

            // Refresh status after submission
            if (entity?.id) {
                const data = await getVerificationByUserId(entity.id);
                if (data) {
                    const status = typeof data === 'string' ? data : data.status;
                    setVerificationStatus(status);
                    if (status === "REJECTED" && data.rejection) {
                        setRejectionDetails(data.rejection);
                    } else {
                        setRejectionDetails(null);
                    }
                }
            }

            // Redirect after a delay
            setTimeout(() => router.push("/find-jobs"), 3000);
        } catch (error: any) {
            console.error("Submission failed:", error);
            toast.error(error.message || "Failed to submit verification request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 font-sans mb-2">Professional Credentials</h2>
                <p className="text-gray-500">Complete this form to verify your medical identity and professional status.</p>

                {verificationStatus === "REJECTED" && (
                    <div className="mt-6 p-6 border border-red-200 bg-red-50/50 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-top-2 duration-500">
                        <div className="flex gap-3 items-start">
                            <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-red-900 text-lg">Verification Rejected</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    Your previous verification request was rejected. Please review the details below, correct your information, and submit again.
                                </p>
                            </div>
                        </div>

                        {rejectionDetails && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-red-100 pt-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Rejected Field</p>
                                    <p className="text-sm font-semibold text-red-900 capitalize">
                                        {rejectionDetails.documentField?.replace(/([A-Z])/g, ' $1').trim() || "N/A"}
                                    </p>
                                </div>
                                {/* <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Reason</p>
                                    <p className="text-sm font-semibold text-red-900">
                                        {rejectionDetails.reason?.reasonText || "No specific reason provided"}
                                    </p>
                                </div> */}
                                {rejectionDetails.reason?.applicableToDoc && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Applicable Document</p>
                                        <p className="text-sm font-semibold text-red-900 uppercase">
                                            {rejectionDetails.reason.applicableToDoc}
                                        </p>
                                    </div>
                                )}
                                {rejectionDetails.customNote && (
                                    <div className="md:col-span-2 space-y-1 bg-white/50 p-3 rounded-xl border border-red-100/50">
                                        <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Custom Note from Reviewer</p>
                                        <p className="text-sm italic text-red-800">
                                            "{rejectionDetails.customNote}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    {/* SECTION 1: Personal Information */}
                    <Section title="1. Personal Information" description="Verify your identity and contact details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="First Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Last Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+1..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="governMentId"
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>Government ID / Passport (Image/PDF)</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-3">
                                                <div className="grow relative">
                                                    <Input
                                                        type="file"
                                                        className="pr-10"
                                                        accept={ACCEPTED_FILE_TYPES.join(",")}
                                                        onChange={(e) => onChange(e.target.files)}
                                                        {...fieldProps}
                                                    />
                                                    <Upload className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-[10px]">PDF, JPG, PNG (Max 5MB)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <SearchableSelect
                                            options={countries}
                                            value={field.value || ""}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                fetchCities(value);
                                                form.setValue('city', '');

                                                // Set phone code if phone is empty or only contains a code
                                                const currentPhone = form.getValues('phone');
                                                const newCode = countryCodes[value];
                                                if (newCode && (!currentPhone || Object.values(countryCodes).some(code => currentPhone === code))) {
                                                    form.setValue('phone', newCode);
                                                }
                                            }}
                                            placeholder={isLoadingCountries ? "Loading countries..." : "Select Country"}
                                            searchPlaceholder="Search country..."
                                            emptyMessage="No country found."
                                            disabled={isLoadingCountries}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <SearchableSelect
                                            options={cities}
                                            value={field.value || ""}
                                            onValueChange={field.onChange}
                                            placeholder={isLoadingCities ? "Loading cities..." : "Select City"}
                                            searchPlaceholder="Search city..."
                                            emptyMessage="No city found."
                                            disabled={isLoadingCities || !form.watch('country')}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="md:col-span-2 mt-2">
                                <FormField
                                    control={form.control}
                                    name="authorizeToVerify"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-xl bg-blue-50/30 border-blue-100">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-semibold text-blue-900">
                                                    I authorize PharmInc to verify my information
                                                </FormLabel>
                                                <FormDescription className="text-xs text-blue-700/70">
                                                    Required for submission. We may contact your licensing board or institution.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 2: Professional Information */}
                    <Section title="2. Professional Information" description="Licensure and clinical specialty details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="professionalTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Professional Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Registered Nurse, Senior Surgeon" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="primarySpecialty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Specialty</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Cardiology, Pediatrics" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="licenseNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>License Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Registration / License No." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <div className="md:col-span-2 space-y-6 pt-4">
                                <FormField
                                    control={form.control}
                                    name="isLicenceSuspended"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-medium">Has your license ever been suspended?</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                {form.watch("isLicenceSuspended") && (
                                    <FormField
                                        control={form.control}
                                        name="licenceSuspensionReason"
                                        render={({ field }) => (
                                            <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <FormLabel className="text-red-600 font-semibold">Suspension Reason</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Provide details of the suspension and its resolution..."
                                                        className="min-h-[100px] border-red-100 focus-visible:ring-red-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 3: Education Information */}
                    <Section title="3. Education Information" description=" Academic background and certifications">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="degree"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Degree</FormLabel>
                                        <FormControl>
                                            <Input placeholder="MBBS, MD, BSN, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="university"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>University / Institution</FormLabel>
                                        <FormControl>
                                            <Input placeholder="University Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="yearOfGraduation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Graduation Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="degreeCertificate"
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>Degree Certificate</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-3">
                                                <div className="grow relative">
                                                    <Input
                                                        type="file"
                                                        className="pr-10"
                                                        accept={ACCEPTED_FILE_TYPES.join(",")}
                                                        onChange={(e) => onChange(e.target.files)}
                                                        {...fieldProps}
                                                    />
                                                    <Upload className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-[10px]">PDF, JPG, PNG (Max 5MB)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:col-span-2 border-t pt-8 mt-4">
                                <div className="flex items-center gap-2 mb-6">
                                    <h4 className="text-sm font-bold text-gray-900">Postgraduate Degree</h4>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase font-medium">Optional</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="postGraduateDegree"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Postgraduate Degree Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Master of Science" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="postGraduateUniversity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Postgraduate University</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="University Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="postGraduateDegreeCertificate"
                                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                                <FormItem>
                                                    <FormLabel>Postgraduate Certificate</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center gap-3">
                                                            <div className="grow relative">
                                                                <Input
                                                                    type="file"
                                                                    className="pr-10"
                                                                    accept={ACCEPTED_FILE_TYPES.join(",")}
                                                                    onChange={(e) => onChange(e.target.files)}
                                                                    {...fieldProps}
                                                                />
                                                                <Upload className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 4: Current Employment */}
                    {entity?.role !== 'STUDENT' && <Section title="4. Current Employment" description="Your present role and workplace (Optional)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="currentEmployer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution / Hospital</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Current Employer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currentRole"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title / Designation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Designation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="practiceCountry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Practice Country</FormLabel>
                                        <SearchableSelect
                                            options={countries}
                                            value={field.value || ""}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                fetchCities(value, true);
                                                form.setValue('practiceCity', '');
                                            }}
                                            placeholder={isLoadingCountries ? "Loading countries..." : "Select Country"}
                                            searchPlaceholder="Search country..."
                                            emptyMessage="No country found."
                                            disabled={isLoadingCountries}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="practiceCity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Practice City</FormLabel>
                                        <SearchableSelect
                                            options={practiceCities}
                                            value={field.value || ""}
                                            onValueChange={field.onChange}
                                            placeholder={isLoadingPracticeCities ? "Loading cities..." : "Select City"}
                                            searchPlaceholder="Search city..."
                                            emptyMessage="No city found."
                                            disabled={isLoadingPracticeCities || !form.watch('practiceCountry')}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Section>}

                    <div className="space-y-6 pt-6 border-t">
                        <FormField
                            control={form.control}
                            name="declaration"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">
                                            I hereby declare that all the information provided in this form is true, correct, and complete to the best of my knowledge.
                                        </FormLabel>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-center pt-8">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-12 h-14 text-base font-bold shadow-lg shadow-blue-500/20 translate-y-0 active:translate-y-0.5 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting Application...
                                </>
                            ) : (
                                "Submit for Verification"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 font-sans">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="p-6 md:p-8">
                {children}
            </div>
        </div>
    );
}
