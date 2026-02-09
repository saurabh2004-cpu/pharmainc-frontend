"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Trash2 } from 'lucide-react';

interface DraftConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onStartFresh: () => void;
  draftInfo?: {
    lastSaved?: string;
    title?: string;
  };
}

export const DraftConfirmationModal: React.FC<DraftConfirmationModalProps> = ({
  open,
  onOpenChange,
  onContinue,
  onStartFresh,
  draftInfo,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Draft Found
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="text-gray-700">
              You have an unsaved draft from your previous session.
            </p>
            {draftInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                {draftInfo.title && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Draft Title:</span>
                    <p className="text-sm font-medium text-gray-900">{draftInfo.title}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-gray-600">Last saved:</span>
                  <p className="text-sm text-gray-700">{formatDate(draftInfo.lastSaved)}</p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Would you like to continue with your draft or start fresh?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            onClick={onStartFresh}
            className="sm:w-auto w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Start Fresh
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onContinue}
            className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Continue Draft
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
