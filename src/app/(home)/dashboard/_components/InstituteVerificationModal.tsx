import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstituteVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InstituteVerificationModal = ({ isOpen, onClose }: InstituteVerificationModalProps) => {
    const router = useRouter();

    if (!isOpen) return null;

    const handleVerifyNow = () => {
        router.push('/verification');
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
                            <div className="w-12 h-12 rounded-full bg-[#169BA4]/10 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-6 h-6 text-[#169BA4]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    Institute Verification Required
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Verify your institute to post jobs
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
                        <div className="bg-[#169BA4]/5 border border-[#169BA4]/20 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                You must verify your institute before posting jobs. This ensures the safety and quality of job listings on our platform.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-green-600">✓</span>
                                </div>
                                <p>Build trust with healthcare professionals</p>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-green-600">✓</span>
                                </div>
                                <p>Gain access to premium hiring features</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-11 transition-all duration-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleVerifyNow}
                                className="flex-1 h-11 bg-[#169BA4] hover:bg-[#169BA4]/90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Verify Now →
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstituteVerificationModal;
