import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { respondToNextRound, interviewDecision } from '@/lib/api/services/application';
import { toast } from 'sonner';

export interface JobApplicationPopupProps {
    id: string;
    type: string;
    title: string;
    message: string;
    status?: string | null;
    receiverRole?: string; // Role of the receiver
    applicationId?: string; // Essential for actions
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
            setTimeout(() => onClose(id), 2000); // Auto close after success
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
            setTimeout(() => onClose(id), 2000); // Auto close after success
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
            setProcessing(false);
        }
    };

    const isNextRoundRequest = status === 'NEXT_ROUND_REQUESTED';
    const isInterviewRequest = status === 'INTERVIEW_SCHEDULED';

    const showActions = isNextRoundRequest &&
        !actionPerformed &&
        applicationId;

    // Render Icons based on type or status
    const renderIcon = () => {
        const iconType = status || type;
        if (iconType === 'NEXT_ROUND_REQUESTED') return <Briefcase className="w-5 h-5 text-purple-600" />;
        // Case 2 fallback: no action buttons for other statuses
        if (iconType === 'HIRED') return <Check className="w-5 h-5 text-green-600" />;
        if (iconType?.includes('REJECTED')) return <X className="w-5 h-5 text-red-600" />;
        if (iconType === 'SHORTLISTED') return <Briefcase className="w-5 h-5 text-blue-500" />;
        if (iconType === 'INTERVIEW_SCHEDULED') return <Calendar className="w-5 h-5 text-blue-600" />;
        return <Check className="w-5 h-5 text-green-600" />;
    };


    return (
        <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 pointer-events-auto flex flex-col gap-4"
            style={{
                width: '550px',
                height: '180px',
                minHeight: '180px',
                maxHeight: '180px'
            }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        {renderIcon()}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">{title}</h4>
                        <p className="text-base text-gray-600 leading-relaxed line-clamp-3">{message}</p>
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
                        onClick={() => isNextRoundRequest ? handleNextRoundResponse('reject') : handleInterviewResponse('reject')}
                        disabled={processing}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 text-sm font-medium px-6"
                    >
                        {isNextRoundRequest ? 'Reject Next Round' : 'Reject'}
                    </Button>
                    <Button
                        size="default"
                        onClick={() => isNextRoundRequest ? handleNextRoundResponse('accept') : handleInterviewResponse('accept')}
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm font-medium px-6"
                    >
                        {processing ? 'Processing...' : (isNextRoundRequest ? 'Accept Next Round' : 'Accept')}
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
