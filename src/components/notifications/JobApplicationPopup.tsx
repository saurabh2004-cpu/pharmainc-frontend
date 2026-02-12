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
    status: string;
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
    const showActions = (isNextRoundRequest || isInterviewRequest) && !actionPerformed && applicationId;

    // Render Icons based on type
    const renderIcon = () => {
        if (isNextRoundRequest) return <Briefcase className="w-5 h-5 text-purple-600" />;
        if (isInterviewRequest) return <Calendar className="w-5 h-5 text-blue-600" />;
        if (status === 'HIRED') return <Check className="w-5 h-5 text-green-600" />;
        if (status?.includes('REJECTED')) return <X className="w-5 h-5 text-red-600" />;
        if (status === 'SHORTLISTED') return <Briefcase className="w-5 h-5 text-blue-500" />;
        return <Check className="w-5 h-5 text-green-600" />;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-full max-w-md mx-auto pointer-events-auto flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        {renderIcon()}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{title}</h4>
                        <p className="text-sm text-gray-600 mt-1 leading-snug">{message}</p>
                    </div>
                </div>
                <button
                    onClick={() => onClose(id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Close notification"
                >
                    <X size={16} />
                </button>
            </div>

            {showActions && (
                <div className="flex gap-2 justify-end mt-1 pt-2 border-t border-gray-50">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => isNextRoundRequest ? handleNextRoundResponse('reject') : handleInterviewResponse('reject')}
                        disabled={processing}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 text-xs font-medium"
                    >
                        Reject
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => isNextRoundRequest ? handleNextRoundResponse('accept') : handleInterviewResponse('accept')}
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-medium px-4"
                    >
                        {processing ? 'Processing...' : 'Accept'}
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
