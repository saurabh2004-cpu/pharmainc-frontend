import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileIncompleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessage: string;
    userId?: string;
}

const ProfileIncompleteModal = ({ isOpen, onClose, errorMessage, userId }: ProfileIncompleteModalProps) => {
    const router = useRouter();

    if (!isOpen || !userId) return null;

    const handleCompleteProfile = () => {
        router.push(`/profile/${userId}`);
        onClose();
    };

    return (
        <>
            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in zoom-in-95 fade-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative p-6 border-b border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    Profile Incomplete
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Complete your profile to continue
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {errorMessage}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-blue-600">1</span>
                                </div>
                                <p>Add your education details</p>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-blue-600">2</span>
                                </div>
                                <p>Add your skills and experience</p>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-blue-600">3</span>
                                </div>
                                <p>Select your speciality</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-11"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCompleteProfile}
                                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            >
                                Complete Profile →
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileIncompleteModal;
