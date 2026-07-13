"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    CircleUserRound,
    Loader2,
    ShieldCheck,
    X,
} from "lucide-react";
import { useCurrentEntity } from "@/lib/utils/entityUtils";
import { checkProfileCompletionPopup } from "@/lib/api";

type ProfileStatusResponse = {
    isComplete?: boolean;
    isVerified?: boolean;
    isLincenceExpired?: boolean;
    error?: string;
};

export default function ProfileStatusNotification() {
    const router = useRouter();
    const { currentEntity } = useCurrentEntity();

    const [status, setStatus] =
        useState<ProfileStatusResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    const userId = currentEntity?.id ?? null;

    const fetchProfileStatus = async () => {
        try {
            setLoading(true);

            const response = await checkProfileCompletionPopup();

            console.log("Check profile status:", response);

            setStatus(response);
        } catch (error) {
            console.error(
                "Failed to check profile completion status:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileStatus();
    }, []);

    const needsVerification =
        status?.isVerified === false ||
        status?.isLincenceExpired === true;

    const needsProfileCompletion =
        status?.isComplete === false;

    const allCompleted =
        status?.isComplete === true &&
        status?.isVerified !== false &&
        status?.isLincenceExpired !== true;

    if (!isVisible || (!loading && (!status || allCompleted))) {
        return null;
    }

    if (loading) return

    return (
        <div className="w-full flex absolute justify-center mx-auto">
            <div className="fixed  top-4 z-[100] w-[calc(100%-2rem)] max-w-[590px]  sm:top-6">
                <div className="relative overflow-hidden rounded-[22px] border border-white/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-white to-emerald-50" />

                    <div className="p-4 sm:p-5">
                        {loading ? (
                            <div className="flex min-h-20 items-center justify-center gap-2 text-sm text-slate-600">
                                {/* <Loader2 className="h-4 w-4 animate-spin" />
                                Checking profile status... */}
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                            <AlertCircle className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                                                Complete your account
                                            </h3>

                                            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                                                {status?.error ||
                                                    "Complete your profile and verification to access all features."}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsVisible(false)}
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                        aria-label="Close notification"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsVisible(false)}
                                        className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:text-sm"
                                    >
                                        Remind me later
                                    </button>

                                    {needsProfileCompletion && userId && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(`/profile/${userId}`)
                                            }
                                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-rose-100 px-4 text-xs font-semibold text-rose-700 transition hover:bg-rose-200 sm:text-sm"
                                        >
                                            <CircleUserRound className="h-4 w-4" />
                                            Complete profile
                                        </button>
                                    )}

                                    {needsVerification && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push("/verification")
                                            }
                                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-emerald-100 px-4 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 sm:text-sm"
                                        >
                                            <ShieldCheck className="h-4 w-4" />

                                            {status?.isLincenceExpired
                                                ? "Renew verification"
                                                : "Verify account"}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}