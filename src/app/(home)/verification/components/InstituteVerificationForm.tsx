"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useEntityStore } from "@/store/entityStore";
import { submitInstituteVerification, getInstituteVerificationByInstituteId, countryCodes } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Institution } from "@/lib/api/types";

// Schema for Institute Verification
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const instituteVerificationSchema = z.object({
    telephone: z.string().min(1, "Telephone is required"),
    email: z.string().email("Invalid email format"),
    adminName: z.string().min(1, "Admin name is required"),
    adminPhone: z.string().min(1, "Admin phone is required"),
    registrationCertificate: z.any().refine((files) => files?.length > 0, "Registration certificate is required"),
});

type InstituteVerificationFormValues = z.infer<typeof instituteVerificationSchema>;

interface InstituteVerificationFormProps {
    verificationStatus: string | null;
    setVerificationStatus: (status: string | null) => void;
}

export function InstituteVerificationForm({ verificationStatus, setVerificationStatus }: InstituteVerificationFormProps) {
    const router = useRouter();
    const { entity } = useEntityStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectionDetails, setRejectionDetails] = useState<any>(null);

    // Fetch rejection details if status is REJECTED
    useEffect(() => {
        const fetchRejectionDetails = async () => {
            if (verificationStatus === "REJECTED" && entity?.id && !rejectionDetails) {
                try {
                    const data = await getInstituteVerificationByInstituteId(entity.id);
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

    const form = useForm<InstituteVerificationFormValues>({
        resolver: zodResolver(instituteVerificationSchema),
        defaultValues: {
            telephone: "",
            email: entity?.email || "",
            adminName: "",
            adminPhone: "",
            registrationCertificate: undefined,
        },
    });

    // Set initial phone codes based on institution country
    useEffect(() => {
        if (entity) {
            const inst = entity as Institution;
            const country = inst.country || "India";
            const dialCode = countryCodes[country] || "";

            if (dialCode) {
                form.reset({
                    ...form.getValues(),
                    telephone: dialCode,
                    adminPhone: dialCode,
                    email: inst.email || "",
                });
            }
        }
    }, [entity, form]);

    const onSubmit: SubmitHandler<InstituteVerificationFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            formData.append("telephone", values.telephone);
            formData.append("email", values.email);
            formData.append("adminName", values.adminName);
            formData.append("adminPhone", values.adminPhone);

            if (values.registrationCertificate?.[0]) {
                formData.append("registrationCertificate", values.registrationCertificate[0]);
            }

            await submitInstituteVerification(formData);
            toast.success("Institute verification application submitted successfully!");

            // Refresh status after submission
            if (entity?.id) {
                const data = await getInstituteVerificationByInstituteId(entity.id);
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

            setTimeout(() => router.push("/dashboard"), 3000);

        } catch (error: any) {
            console.error("Submission failed:", error);
            toast.error(error.message || "Failed to submit verification request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-4 md:py-12 px-1 md:px-4 max-w-4xl">
            <div className="mb-10">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 font-sans mb-2">Institute Verification</h2>
                <p className="text-gray-500">Provide official details to verify your institute's identity.</p>

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
                    <Section title="Institute Details" description="Official contact and registration information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institute Telephone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Official telephone number" {...field} />
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
                                        <FormLabel>Institute Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Official email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="adminName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full name of administrator" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="adminPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Direct phone number of administrator" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="registrationCertificate"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel>Registration Certificate (Image/PDF)</FormLabel>
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
                            </div>
                        </div>
                    </Section>

                    <div className="flex items-center justify-center pt-2 lg:pt-8">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-12 h-14 text-base font-bold shadow-lg shadow-blue-500/20 translate-y-0 active:translate-y-0.5 transition-all bg-[#233F64] hover:bg-[#169BA4]"
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
