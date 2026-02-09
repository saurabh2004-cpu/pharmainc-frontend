"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import React from 'react';
import { createJob } from "@/lib/api";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const jobCategories = ["Doctor", "Nurse", "Intern", "Dentist", "Orthodontist", "Surgeon", "Other"];
const workLocations = ["On-site", "Remote", "Hybrid"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Expert Level"];
const benefits = ["Health Insurance", "Travel Allowance", "Housing", "Paid Time Off", "Bonuses"];

const jobPostingSchema = z.object({
  title: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  pay_range: z.string().min(1, { message: "Pay range is required." }),
  benefits: z.array(z.string()).refine((value) => value.length > 0, { message: "Select at least one benefit." }),
  category: z.string({ message: "Please select a job category." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  work_location: z.string({ message: "Please select a work location." }),
  experience_level: z.string({ message: "Please select an experience level." }),
  specialization: z.string().min(2, { message: "Specialization must be at least 2 characters." }),
});

type JobPostingFormValues = z.infer<typeof jobPostingSchema>;

const JobPostingForm = () => {
  const router = useRouter();
  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: "",
      description: "",
      pay_range: "",
      benefits: [],
      category: "",
      location: "",
      role: "",
      work_location: "",
      experience_level: "",
      specialization: "",
    },
  });

  async function onSubmit(data: JobPostingFormValues) {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        pay_range: data.pay_range,
        benefits: data.benefits.join(', '),
        // Backend 'jobType' expects Role (Doctor), so we map category here
        jobType: data.category,
        location: data.location,
        role: "Full-time",
        speciality: data.role,
        experience_level: data.experience_level,
        specialization: data.specialization,
      };

      // await createJob(payload);
      toast.success("Job posted successfully!");
      form.reset();

      // Optionally redirect to jobs page
      // router.push('/jobs');
    } catch (error: any) {
      toast.error("Failed to post job: " + (error.message || "Unknown error"));
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col bg-white">


      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create New Job Posting
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill out the form below to post a job opening and attract top healthcare talent.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Senior Cardiologist"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Mumbai, Maharashtra"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the role, responsibilities, and what makes this position unique..."
                            className="min-h-[120px] bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pay_range"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Pay Range</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., ₹15-25 LPA"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Cardiologist, Surgeon"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Job Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jobCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                      name="work_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Work Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <SelectValue placeholder="Select work location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workLocations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="experience_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
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
                    name="benefits"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Benefits Offered</FormLabel>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          {benefits.map((benefit) => (
                            <FormField
                              key={benefit}
                              control={form.control}
                              name="benefits"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(benefit)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, benefit])
                                          : field.onChange(field.value?.filter((value) => value !== benefit));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-gray-700">{benefit}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-sm text-white"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Posting Job..." : "Post Job"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
