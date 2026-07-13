"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertTriangle,
    BadgeCheck,
    CircleUserRound,
    Loader2,
    ShieldCheck,
    Sparkles,
    X,
} from "lucide-react";
import { useCurrentEntity } from "@/lib/utils/entityUtils";
import { checkProfileCompletion } from "@/lib/api";

type ProfileStatusResponse = {
    isComplete?: boolean;
    isVerified?: boolean;
    isLincenceExpired?: boolean;
    error?: string;
};

export default function ProfileCompletionBanner() {
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

            const response = await checkProfileCompletion();

            setStatus(response);
        } catch (error: any) {
            const responseData =
                error?.response?.data as ProfileStatusResponse | undefined;

            if (responseData) {
                setStatus(responseData);
            } else {
                console.error(
                    "Failed to check profile completion status:",
                    error
                );
            }
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
        <section className="w-full  py-5 ">
            <div className="mx-auto w-full max-w-6xl">
                <div className="relative overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-emerald-50 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                    <div className="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-200/30 blur-3xl" />
                    <div className="absolute -right-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

                    <button
                        type="button"
                        onClick={() => setIsVisible(false)}
                        className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/80 hover:text-slate-700 sm:right-4 sm:top-4"
                        aria-label="Dismiss notification"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {loading ? (
                        <div className="relative z-10 flex min-h-28 items-center justify-center gap-2 px-5 py-6 text-sm text-slate-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Checking profile status...
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-100 sm:h-14 sm:w-14">
                                    {status?.isLincenceExpired ? (
                                        <AlertTriangle className="h-6 w-6" />
                                    ) : (
                                        <Sparkles className="h-6 w-6" />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                            Complete your account setup
                                        </h2>

                                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-100">
                                            Action required
                                        </span>
                                    </div>

                                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
                                        {status?.error ||
                                            "Get verified and complete your profile to apply for jobs and access all account features."}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <StatusItem
                                            completed={!needsVerification}
                                            label={
                                                status?.isLincenceExpired
                                                    ? "Verification expired"
                                                    : "Account verification"
                                            }
                                        />

                                        <StatusItem
                                            completed={!needsProfileCompletion}
                                            label="Profile completion"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:shrink-0">
                                {needsVerification && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/verification")
                                        }
                                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#169BA4] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12858d] focus:outline-none focus:ring-2 focus:ring-[#169BA4]/30 sm:w-auto"
                                    >
                                        <ShieldCheck className="h-4 w-4" />

                                        {status?.isLincenceExpired
                                            ? "Renew verification"
                                            : "Get verified"}
                                    </button>
                                )}

                                {needsProfileCompletion && userId && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(`/profile/${userId}`)
                                        }
                                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-100 sm:w-auto"
                                    >
                                        <CircleUserRound className="h-4 w-4" />
                                        Complete profile
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

type StatusItemProps = {
    completed: boolean;
    label: string;
};

function StatusItem({
    completed,
    label,
}: StatusItemProps) {
    return (
        <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${completed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
                }`}
        >
            {completed ? (
                <BadgeCheck className="h-3.5 w-3.5" />
            ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
            )}

            {label}
        </div>
    );
}