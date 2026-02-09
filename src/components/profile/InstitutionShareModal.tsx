"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, Link2Icon, MessageCircle, Share2Icon } from "lucide-react";
import { BiLogoLinkedin, BiLogoTwitter } from "react-icons/bi";
import { Institution } from "@/lib/api";

interface InstitutionShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
}

export default function InstitutionShareModal({ isOpen, onClose, institution }: InstitutionShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const institutionUrl = `${window.location.origin}/institute/${institution.id}`;
  const shareText = `Check out ${institution.name}'s profile on PharmInc - ${institution.type} in ${institution.location}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(institutionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
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
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(institutionUrl)}`, '_blank');
      },
      color: "text-sky-500 hover:text-sky-600 hover:bg-sky-50"
    },
    {
      name: "LinkedIn",
      icon: BiLogoLinkedin,
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(institutionUrl)}`, '_blank');
      },
      color: "text-blue-700 hover:text-blue-800 hover:bg-blue-50"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${institutionUrl}`)}`, '_blank');
      },
      color: "text-green-600 hover:text-green-700 hover:bg-green-50"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2Icon className="h-5 w-5" />
            Share Institution
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Institution Link</span>
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
              {institutionUrl}
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

          {/* Institution Preview */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-2">Institution Preview</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {institution.name?.[0]?.toUpperCase() || "I"}
                </div>
                <div>
                  <span className="text-sm font-semibold block">{institution.name || "Unknown Institution"}</span>
                  <span className="text-xs text-gray-600">{institution.type}</span>
                  {institution.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-500">{institution.location}</span>
                    </div>
                  )}
                </div>
              </div>
              {institution.bio && (
                <p className="text-xs text-gray-700 line-clamp-2 mt-2">
                  {institution.bio.substring(0, 120)}
                  {institution.bio.length > 120 && '...'}
                </p>
              )}
              <div className="flex gap-4 mt-2 text-xs text-gray-600">
                {institution.followers !== undefined && (
                  <span>{institution.followers} followers</span>
                )}
                {institution.area_of_expertise && (
                  <span>{institution.area_of_expertise}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
