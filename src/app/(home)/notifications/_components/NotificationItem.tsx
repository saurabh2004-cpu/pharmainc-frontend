import React, { useState } from 'react'
import { MessageCircle, UserPlus, Briefcase, Check, X, Calendar, UserCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import { buildNotificationMessage } from '@/lib/utils/notificationUtils'

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
  relatedInstituteId?: string | null
  interviewType?: string
  interviewDate?: string
  interviewTime?: string
  interviewLink?: string
  onAccept?: (id: string, applicationId: string) => Promise<void>
  onReject?: (id: string, applicationId: string) => Promise<void>
}

export const NotificationItem = ({
  id,
  type,
  title,
  message,
  timestamp,
  time,
  status,
  jobTitle,
  instituteName,
  applicantName,
  applicationId,
  read,
  relatedJobId,
  relatedApplicationId,
  relatedInstituteId,
  interviewType,
  interviewDate,
  interviewTime,
  interviewLink,
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
    if (status === 'HIRED') return <Image src="/firework.png" alt="Hired" width={20} height={20} />;
    if (status === 'APPLIED') return <UserPlus className="w-5 h-5 text-blue-500" />;
    return <MessageCircle className="w-5 h-5 text-gray-500" />;
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

  const displayContent = buildNotificationMessage({
    status,
    message,
    application: {
      job: {
        id: (relatedJobId as string),
        title: jobTitle,
        institute: {
          id: (relatedInstituteId as string) || "",
          name: instituteName
        }
      }
    }
  } as any);

  return (
    <div className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 font-sans ${getBgColor()}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100`}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">
                {title || (instituteName ? `${instituteName}` : 'Notification')}
              </h4>
              <div className="text-sm text-gray-600 mt-0.5">
                {displayContent}
              </div>

              {/* Interview Details */}
              {status === 'INTERVIEW_SCHEDULED' && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
                    <Calendar size={14} />
                    <span>Interview Details ({interviewType})</span>
                  </div>

                  {interviewLink ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-600">
                        Date: {interviewDate} | Time: {interviewTime}
                      </p>
                      <Link
                        href={interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors w-fit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join Interview
                      </Link>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-700">
                      The interviewer will call you at {interviewDate} {interviewTime}.
                    </p>
                  )}
                </div>
              )}

              {/* Context details */}
              {(jobTitle && instituteName && status !== 'INTERVIEW_SCHEDULED') && (
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

          {/* Action Buttons for Next Round (if enabled) */}
          {/* {status === 'NEXT_ROUND_REQUESTED' && !actionTaken && (
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
          )} */}
        </div>
      </div>
    </div>
  )
}
