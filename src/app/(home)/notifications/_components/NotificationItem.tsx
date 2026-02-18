import React, { useState } from 'react'
import { Heart, MessageCircle, UserPlus, Briefcase, Check, X, Calendar, UserCheck, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

export interface NotificationItemProps {
  id?: string
  type: string
  title?: string
  message?: string
  timestamp?: string
  time?: string
  status?: string
  jobTitle?: string
  instituteName?: string
  applicantName?: string
  applicationId?: string
  read: boolean
  relatedJobId?: string | null
  relatedApplicationId?: string | null
  onAccept?: (id: string, applicationId: string) => Promise<void>
  onReject?: (id: string, applicationId: string) => Promise<void>
}

export const NotificationItem = ({
  id,
  type,
  title,
  message,
  timestamp,
  time, // formatted time passed from parent
  status,
  jobTitle,
  instituteName,
  applicantName,
  applicationId,
  read,
  onAccept,
  onReject
}: NotificationItemProps) => {
  const [processing, setProcessing] = useState(false);
  const [actionTaken, setActionTaken] = useState(false);

  // Helper to determine icon based on status
  const getIcon = () => {
    if (status === 'NEXT_ROUND_REQUESTED') return <Briefcase className="w-5 h-5 text-orange-500" />;
    if (status === 'INTERVIEW_SCHEDULED') return <Calendar className="w-5 h-5 text-blue-500" />;
    if (status?.includes('ACCEPTED')) return <Check className="w-5 h-5 text-green-500" />;
    if (status?.includes('REJECTED')) return <X className="w-5 h-5 text-red-500" />;
    if (status === 'HIRED') return <UserCheck className="w-5 h-5 text-green-600" />;
    if (status === 'APPLIED') return <UserPlus className="w-5 h-5 text-blue-500" />;
    return <MessageCircle className="w-5 h-5 text-gray-500" />; // Default
  }

  const getBgColor = () => {
    if (status === 'HIRED') return 'bg-green-50';
    if (!read) return 'bg-blue-50/30';
    return '';
  }

  const handleAction = async (action: 'accept' | 'reject') => {
    if (!applicationId || !id) return;
    setProcessing(true);
    try {
      if (action === 'accept' && onAccept) await onAccept(id, applicationId);
      if (action === 'reject' && onReject) await onReject(id, applicationId);
      setActionTaken(true);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  }

  // Logic to show Accept/Reject actions
  // Disabled for the notification list as requested
  const showActions = false;

  return (
    <div className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 font-sans ${getBgColor()}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100`}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {title || (instituteName ? `${instituteName}` : 'Notification')}
              </h4>
              <p className="text-sm text-gray-600 mt-0.5">
                {message || (jobTitle ? `Update regarding ${jobTitle}` : 'You have a new notification')}
              </p>

              {/* Context details */}
              {(jobTitle && instituteName) && (
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Briefcase size={12} />
                  <span>{jobTitle}</span>
                  <span>•</span>
                  <span>{instituteName}</span>
                </div>
              )}

              {/* Institute specific context */}
              {applicantName && (
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <UserPlus size={12} />
                  <span>Applicant: {applicantName}</span>
                </div>
              )}
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {time || (timestamp && new Date(timestamp).toLocaleDateString())}
            </span>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-3 mt-3">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-8"
                onClick={(e) => { e.stopPropagation(); handleAction('accept'); }}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Accept Next Round'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={(e) => { e.stopPropagation(); handleAction('reject'); }}
                disabled={processing}
              >
                Reject Next Round
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
