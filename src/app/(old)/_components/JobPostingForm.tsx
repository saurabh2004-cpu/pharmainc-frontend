"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
// import { jobApiClient } from "../services/apiClient"; 

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

const jobCategories = ["Doctor", "Nurse", "Intern", "Dentist", "Orthodontist", "Surgeon", "Other"];
const benefits = ["Health Insurance", "Travel Allowance", "Housing", "Paid Time Off", "Bonuses"];
const skills = ["Patient Care", "Medical-Surgical", "Emergency Medicine", "Communication Skills", "Electronic Health Records (EHR)"];

const jobPostingSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  jobDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  salary: z.string().min(1, { message: "Salary is required." }),
  workingHours: z.string().min(1, { message: "Working hours are required." }),
  benefits: z.array(z.string()).refine((value) => value.length > 0, { message: "Select at least one benefit." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  jobCategory: z.string({ message: "Please select a job category." }),
  skills: z.array(z.string()).refine((value) => value.length > 0, { message: "Select at least one skill." }),
  eligibility: z.string().min(10, { message: "Eligibility must be at least 10 characters." }),
});

type JobPostingFormValues = z.infer<typeof jobPostingSchema>;

const JobPostingForm = () => {
  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      salary: "",
      workingHours: "",
      benefits: [],
      location: "",
      skills: [],
      eligibility: "",
    },
  });

  async function onSubmit(data: JobPostingFormValues) {
    try {
      // Prepare the payload to match your backend's expected structure
      const payload = {
  title: data.jobTitle,
  description: data.jobDescription,
  payRange: data.salary,
  workingHours: data.workingHours,
  benefits: data.benefits.join(', '), // ← Convert array to string
  location: data.location,
  category: data.jobCategory,
  skills: data.skills.join(', '),     // ← Also convert to string if needed
  eligibility: data.eligibility,
};


      // await jobApiClient.post("/private/job", payload);

      toast.success("Job posted successfully!");
      form.reset();
    } catch (error: any) {
      toast.error("Failed to post job: " + (error.message || "Unknown error"));
      console.error(error);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto bg-white border border-[#e1e9f2] shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-[#23497d]">
          <br />
          Post a New Job
        </CardTitle>
        <CardDescription className="text-[#5471a6]">
          Fill out the form below to post a job opening.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cardiologist" {...field} />
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mumbai, MH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the responsibilities..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary / Pay Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ₹1,00,000 per month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9 AM - 5 PM, 6 days a week" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="benefits"
                render={() => (
                  <FormItem>
                    <FormLabel>Benefits Offered</FormLabel>
                    <div className="space-y-2">
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
                              <FormLabel className="font-normal">{benefit}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <FormField
                          key={skill}
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(skill)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, skill])
                                      : field.onChange(field.value?.filter((value) => value !== skill));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{skill}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="eligibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify qualifications, experience, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full md:w-auto bg-[#2763ed] hover:bg-[#1e51c3] font-bold rounded-md shadow text-white px-8"
            >
              Post Job
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JobPostingForm;
