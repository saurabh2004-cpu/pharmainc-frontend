"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Post } from "./types";
import { CopyIcon, Link2Icon, MessageCircle } from "lucide-react";
import { BiLogoLinkedin, BiLogoTwitter } from "react-icons/bi";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export default function ShareModal({ isOpen, onClose, post }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const postUrl = `${window.location.origin}/post/${post.id}`;
  const shareText = `Check out what ${post.author} is saying on Pharminc : ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
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
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, '_blank');
      },
      color: "text-sky-500 hover:text-sky-600 hover:bg-sky-50"
    },
    {
      name: "LinkedIn",
      icon: BiLogoLinkedin,
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
      },
      color: "text-blue-700 hover:text-blue-800 hover:bg-blue-50"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${postUrl}`)}`, '_blank');
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
            Share Post
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Post Link</span>
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
              {postUrl}
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

          {/* Post Preview */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-2">Post Preview</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{post.author}</span>
                <span className="text-xs text-gray-500">• {post.time}</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">
                {post.content.substring(0, 150)}
                {post.content.length > 150 && '...'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
