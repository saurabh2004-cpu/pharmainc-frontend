"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, Link2Icon, MessageCircle } from "lucide-react";
import { BiLogoLinkedin, BiLogoTwitter } from "react-icons/bi";
import { Job, Institution } from "@/lib/api/types";
import { copyToClipboard } from "@/lib/utils/clipboard";

interface JobShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export default function JobShareModal({ isOpen, onClose, job }: JobShareModalProps) {
  const [copied, setCopied] = useState(false);

  const jobUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this job opportunity: ${job.title} at ${job.institute?.name || 'Healthcare Institute'} on Pharminc`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(jobUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: CopyIcon,
      action: handleCopyLink,
      color: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
    },
    {
      name: "Twitter",
      icon: BiLogoTwitter,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`, '_blank');
      },
      color: "text-sky-500 hover:text-sky-600 hover:bg-sky-50"
    },
    {
      name: "LinkedIn",
      icon: BiLogoLinkedin,
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`, '_blank');
      },
      color: "text-blue-700 hover:text-blue-800 hover:bg-blue-50"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${jobUrl}`)}`, '_blank');
      },
      color: "text-green-600 hover:text-green-700 hover:bg-green-50"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2Icon className="h-5 w-5" />
            Share Job
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Job Link</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 px-3"
              >
                <CopyIcon className="h-3 w-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="text-xs text-gray-600 bg-white p-2 rounded border break-all">
              {jobUrl}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-3">Share via</p>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  onClick={option.action}
                  className={`justify-start h-12 ${option.color}`}
                >
                  <option.icon className="h-4 w-4 mr-3" />
                  {option.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Job Preview */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-2">Job Preview</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {job.institute?.name?.charAt(0) || job.title.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold">{job.title}</div>
                  <div className="text-xs text-gray-500">
                    {job.institute?.name || 'Healthcare Institute'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.jobType}</span>
                {job.salaryMin && job.salaryMax && (
                  <>
                    <span>•</span>
                    <span>{job.salaryCurrency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
