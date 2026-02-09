"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Phone, Mail, User } from "lucide-react";
import { toast } from "sonner";

interface JobPostingInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  instituteName: string;
  description: string;
}

export function JobPostingInterestModal({ isOpen, onClose }: JobPostingInterestModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    instituteName: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.instituteName.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Callback request submitted:", formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Request submitted successfully! We'll contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        instituteName: "",
        description: "",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-green-600" />
            Interested in Posting Jobs?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pb-4">
          <p className="text-gray-600 text-sm">
            Build your institution presence on PharmInc! Fill out the form below and we'll contact you to help set up your job posting capabilities.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instituteName" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Institute Name
              </Label>
              <Input
                id="instituteName"
                name="instituteName"
                type="text"
                placeholder="Enter your institute/organization name"
                value={formData.instituteName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Tell us about yourself
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your background, institution, and what makes you a great fit for job posting privileges..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="resize-none break-all overflow-hidden w-full max-w-full"
                style={{ 
                  wordWrap: 'break-word', 
                  overflowWrap: 'anywhere', 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Request Callback"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
