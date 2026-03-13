import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Briefcase, Calendar } from 'lucide-react';
import { respondToNextRound, interviewDecision } from '@/lib/api/services/application';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { buildNotificationMessage } from '@/lib/utils/notificationUtils';

export interface JobApplicationPopupProps {
    id: string;
    type: string;
    title: string;
    message: string;
    status?: string | null;
    receiverRole?: string;
    applicationId?: string;
    relatedJobId?: string;
    relatedInstituteId?: string;
    jobTitle?: string;
    instituteName?: string;
    applicantName?: string;
    interviewType?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewLink?: string;
    onClose: (id: string) => void;
    onActionComplete?: (id: string) => void;
}

export const JobApplicationPopup = ({
    id,
    type,
    title,
    message,
    status,
    receiverRole,
    applicationId,
    relatedJobId,
    relatedInstituteId,
    jobTitle,
    instituteName,
    applicantName,
    interviewType,
    interviewDate,
    interviewTime,
    interviewLink,
    onClose,
    onActionComplete
}: JobApplicationPopupProps) => {
    const [processing, setProcessing] = useState(false);
    const [actionPerformed, setActionPerformed] = useState(false);

    const handleNextRoundResponse = async (responseStatus: 'accept' | 'reject') => {
        if (!applicationId) return;
        setProcessing(true);
        try {
            await respondToNextRound(applicationId, responseStatus);
            toast.success(responseStatus === 'accept' ? 'Next round accepted' : 'Next round rejected');
            setActionPerformed(true);
            if (onActionComplete) onActionComplete(id);
            setTimeout(() => onClose(id), 2000);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
            setProcessing(false);
        }
    };

    const handleInterviewResponse = async (decision: 'accept' | 'reject') => {
        if (!applicationId) return;
        setProcessing(true);
        try {
            await interviewDecision(applicationId, decision);
            toast.success(decision === 'accept' ? 'Interview accepted' : 'Interview rejected');
            setActionPerformed(true);
            if (onActionComplete) onActionComplete(id);
            setTimeout(() => onClose(id), 2000);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
            setProcessing(false);
        }
    };

    const isNextRoundRequest = status === 'NEXT_ROUND_REQUESTED';
    const isInterviewScheduled = status === 'INTERVIEW_SCHEDULED';

    const showActions = isNextRoundRequest && !actionPerformed && applicationId;

    const renderIcon = () => {
        const iconType = status || type;
        if (iconType === 'NEXT_ROUND_REQUESTED') return <Briefcase className="w-5 h-5 text-purple-600" />;
        if (iconType === 'HIRED') return <Image src="/firework.png" className="mb-6" alt="Hired" width={45} height={45} />;
        if (iconType?.includes('REJECTED')) return <X className="w-5 h-5 text-red-600" />;
        if (iconType === 'SHORTLISTED') return <Briefcase className="w-5 h-5 text-blue-500" />;
        if (iconType === 'INTERVIEW_SCHEDULED') return <Calendar className="w-5 h-5 text-blue-600" />;
        return <Check className="w-5 h-5 text-green-600" />;
    };


    const displayContent = buildNotificationMessage({
        status: status || type,
        message,
        application: {
            job: {
                id: relatedJobId || "",
                title: jobTitle || title,
                institute: {
                    id: relatedInstituteId || "",
                    name: instituteName || ""
                }
            },
            user: {
                name: applicantName || ""
            }
        }
    } as any);

    return (
        <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 pointer-events-auto flex flex-col gap-4"
            style={{
                width: '550px',
                minHeight: '180px',
            }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        {renderIcon()}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                            {title}
                        </h4>
                        <div className="text-base text-gray-600 leading-relaxed">
                            {displayContent}
                        </div>

                        {/* Interview Details in Popup */}
                        {isInterviewScheduled && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
                                    <Calendar size={14} />
                                    <span>Interview Scheduled ({interviewType})</span>
                                </div>

                                {interviewLink ? (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs text-gray-600">
                                            {interviewDate} at {interviewTime}
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
                    </div>
                </div>
                <button
                    onClick={() => onClose(id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 flex-shrink-0"
                    aria-label="Close notification"
                >
                    <X size={20} />
                </button>
            </div>

            {showActions && (
                <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
                    <Button
                        size="default"
                        variant="ghost"
                        onClick={() => handleNextRoundResponse('reject')}
                        disabled={processing}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 text-sm font-medium px-6"
                    >
                        Reject Next Round
                    </Button>
                    <Button
                        size="default"
                        onClick={() => handleNextRoundResponse('accept')}
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm font-medium px-6"
                    >
                        {processing ? 'Processing...' : 'Accept Next Round'}
                    </Button>
                </div>
            )}

            {actionPerformed && (
                <div className="mt-1 pt-2 border-t border-gray-50 flex items-center gap-2 text-xs text-green-600 font-medium">
                    <Check size={12} />
                    <span>Action completed</span>
                </div>
            )}
        </div>
    );
};
