"use client";

import { useState } from "react";
import {
    BriefcaseBusiness,
    Lightbulb,
    MessageCircle,
    Send,
    X,
} from "lucide-react";
import { createUserFeedback } from "@/lib/api/services/userFeedbacks";
import { toast } from "sonner";
import { UserFeedbackType } from "@/lib/api";
import { getCurrentEntity, isInstitution } from "@/lib/utils/entityUtils";

const popupOptions = [
    {
        id: "jobs",
        feedbackType: UserFeedbackType.JOB_LOOKING,
        title: "What jobs are you looking for?",
        description: "Tell us what roles or opportunities interest you.",
        icon: BriefcaseBusiness,
    },
    {
        id: "features",
        feedbackType: UserFeedbackType.FEATURE,
        title: "What would you like to see added?",
        description: "Share a feature or improvement suggestion.",
        icon: Lightbulb,
    },
    {
        id: "chat",
        feedbackType: UserFeedbackType.CHAT,
        title: "Chat with us",
        description: "Send us a message and our team will respond.",
        icon: MessageCircle,
    },
];

export default function HomeFeedbackPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<UserFeedbackType | undefined>(undefined);
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isInstitute = isInstitution(getCurrentEntity())


    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !selectedOption ||
            !message.trim() ||
            isSubmitting
        ) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await createUserFeedback({
                feedbackType: selectedOption,
                message: message.trim(),
            });

            toast.success(res.message);

            setIsSubmitted(true);
            setSelectedOption(undefined);
            setMessage("");

            setTimeout(() => {
                setIsSubmitted(false);
                setIsOpen(false);
            }, 1800);
        } catch (error) {
            console.error(
                "Error while creating feedback",
                error
            );

            toast.error("Failed to create feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
            {isOpen && (
                <div className="mb-4 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <div className="flex items-start justify-between bg-gradient-to-b from-[#D2F0F2] via-[#D9F7F1] to-[#E6FCFA] px-5 py-4 text-white">
                        <div>
                            <p className="text-base text-black font-semibold">How can we help?</p>
                            <p className="mt-1 text-sm text-black/80">
                                Choose an option and leave us a message.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close popup"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 p-5">
                        <div className="space-y-2">
                            {popupOptions.map((option) => {
                                const Icon = option.icon;
                                const isSelected = selectedOption === option.feedbackType;
                                if (isInstitute && option.id === "jobs") {
                                    return null;
                                }

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setSelectedOption(option.feedbackType)}
                                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${isSelected
                                            ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div
                                            className={`mt-0.5 rounded-lg p-2 ${isSelected
                                                ? "bg-cyan-500 text-white"
                                                : "bg-slate-100 text-slate-700"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {option.title}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Write your message here..."
                            rows={4}
                            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        />

                        {isSubmitted && (
                            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                Thank you! Your message has been received.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={
                                !selectedOption ||
                                !message.trim() ||
                                isSubmitting
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            <Send className="h-4 w-4" />

                            {isSubmitting
                                ? "Sending..."
                                : "Send message"}
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#169BA4] text-white shadow-lg transition hover:scale-105 hover:bg-[#169BA4]/80"
                aria-label={isOpen ? "Close feedback popup" : "Open feedback popup"}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>
        </div>
    );
}