"use client";

import {
    Clock,
    ExternalLink,
    HeartPulse,
    Newspaper,
    RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getTrendingMedicalNews } from "@/app/actions/medicalNews";


type MedicalNewsArticle = {
    id: string;
    title: string;
    description: string;
    url: string;
    image: string | null;
    publishedAt: string;
    source: {
        name: string;
        url: string | null;
        country: string | null;
    };
};

type MedicalNewsResponse = {
    message: string;
    totalArticles?: number;
    articles: MedicalNewsArticle[];
};

type MedicalNewsSidebarProps = {
    className?: string;
};

const formatTimeAgo = (dateString: string) => {
    const publishedDate = new Date(dateString);

    if (Number.isNaN(publishedDate.getTime())) {
        return "";
    }

    const now = new Date();

    const differenceInSeconds = Math.floor(
        (now.getTime() - publishedDate.getTime()) / 1000
    );

    if (differenceInSeconds < 60) {
        return "just now";
    }

    if (differenceInSeconds < 3600) {
        return `${Math.floor(
            differenceInSeconds / 60
        )}m ago`;
    }

    if (differenceInSeconds < 86400) {
        return `${Math.floor(
            differenceInSeconds / 3600
        )}h ago`;
    }

    if (differenceInSeconds < 604800) {
        return `${Math.floor(
            differenceInSeconds / 86400
        )}d ago`;
    }

    return new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(publishedDate);
};

export default function MedicalNewsSidebar({
    className = "",
}: MedicalNewsSidebarProps) {
    const [articles, setArticles] = useState<
        MedicalNewsArticle[]
    >([]);

    const [loading, setLoading] = useState(true);


    const [error, setError] = useState<string | null>(
        null
    );

    const [isPending, startTransition] = useTransition();

    const fetchMedicalNews = useCallback(() => {
        startTransition(async () => {
            try {
                setError(null);

                const result = await getTrendingMedicalNews();

                // console.log("result news", result)

                // if (result.success) {
                //     setArticles(result.articles);
                // } else {
                //     setError(result.message);
                // }

                if (!result.success) {
                    setArticles([]);
                    setError(result.message);
                    return;
                }

                setArticles(result.articles);
            } catch (error) {
                console.error(
                    "Error loading medical news:",
                    error
                );

                setArticles([]);
                setError("Failed to load medical news");
            } finally {
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        fetchMedicalNews();
    }, [fetchMedicalNews]);

    const openArticle = (url: string) => {
        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <aside
            className={`order-first w-full lg:order-last lg:w-[20rem] lg:flex-shrink-0 ${className}`}
        >
            <div className="lg:sticky lg:top-4">
                <div className="border-t border-gray-200 bg-white lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:rounded-lg lg:border">
                    <div className=" ">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#169BA4]/10 text-[#169BA4]">
                                        <HeartPulse className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                                            Trending  News
                                        </h3>

                                        <p className="text-xs text-gray-500">
                                            Latest health and medical headlines
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchMedicalNews()
                                    }
                                    disabled={loading}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#169BA4]/40 hover:bg-[#169BA4]/5 hover:text-[#169BA4] disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Refresh medical news"
                                    title="Refresh news"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${isPending
                                            ? "animate-spin"
                                            : ""
                                            }`}
                                    />
                                </button>
                            </div>

                            {loading ? (
                                <NewsLoadingSkeleton />
                            ) : error ? (
                                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-4 text-center">
                                    <p className="text-xs font-medium text-red-700">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fetchMedicalNews()
                                        }
                                        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-100"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Try again
                                    </button>
                                </div>
                            ) : articles.length > 0 ? (
                                <div className="space-y-3">
                                    {articles
                                        .slice(0, 5)
                                        .map((article) => (
                                            <article
                                                key={article.id}
                                                role="link"
                                                tabIndex={0}
                                                onClick={() =>
                                                    openArticle(article.url)
                                                }
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key === "Enter" ||
                                                        event.key === " "
                                                    ) {
                                                        event.preventDefault();
                                                        openArticle(article.url);
                                                    }
                                                }}
                                                className="group cursor-pointer rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#169BA4]/30"
                                            >
                                                <div className="flex gap-3">
                                                    {article.image ? (
                                                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-gray-200">
                                                            {/* External news images use a normal img
                                  to avoid configuring every source domain
                                  in next.config.ts. */}
                                                            <img
                                                                src={article.image}
                                                                alt=""
                                                                loading="lazy"
                                                                referrerPolicy="no-referrer"
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                onError={(event) => {
                                                                    event.currentTarget.style.display =
                                                                        "none";
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md bg-[#169BA4]/10 text-[#169BA4]">
                                                            <Newspaper className="h-5 w-5" />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="line-clamp-2 text-sm font-medium leading-5 text-gray-900 transition-colors group-hover:text-[#169BA4]">
                                                            {article.title}
                                                        </h4>

                                                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                                                            <span className="max-w-[115px] truncate font-medium">
                                                                {article.source.name}
                                                            </span>

                                                            <span aria-hidden="true">
                                                                •
                                                            </span>

                                                            <span className="flex shrink-0 items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {formatTimeAgo(
                                                                    article.publishedAt
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {article.description && (
                                                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">
                                                        {article.description}
                                                    </p>
                                                )}

                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="rounded-full border border-[#169BA4]/30 bg-[#169BA4]/10 px-2 py-0.5 text-[11px] font-medium text-[#169BA4]">
                                                        Medical News
                                                    </span>

                                                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400 transition-colors group-hover:text-[#169BA4]">
                                                        Read article
                                                        <ExternalLink className="h-3 w-3" />
                                                    </span>
                                                </div>
                                            </article>
                                        ))}
                                </div>
                            ) : (
                                <div className="py-6 text-center">
                                    <Newspaper className="mx-auto mb-2 h-6 w-6 text-gray-300" />

                                    <p className="text-xs text-gray-500">
                                        No medical news is available
                                        right now.
                                    </p>
                                </div>
                            )}

                            <p className="mt-4 text-center text-[10px] leading-4 text-gray-400">
                                Headlines are provided by external
                                publishers. Open an article to read it
                                at its original source.
                            </p>
                        </div>

                        <div className="h-4" />
                    </div>
                </div>
            </div>
        </aside>
    );
}

function NewsLoadingSkeleton() {
    return (
        <div
            className="space-y-3"
            aria-label="Loading medical news"
        >
            {Array.from({ length: 5 }).map(
                (_, index) => (
                    <div
                        key={index}
                        className="animate-pulse rounded-lg bg-gray-50 p-3"
                    >
                        <div className="flex gap-3">
                            <div className="h-16 w-20 shrink-0 rounded-md bg-gray-200" />

                            <div className="min-w-0 flex-1">
                                <div className="mb-2 h-4 w-full rounded bg-gray-200" />
                                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                                <div className="h-3 w-1/2 rounded bg-gray-200" />
                            </div>
                        </div>

                        <div className="mt-3 h-3 w-full rounded bg-gray-200" />
                    </div>
                )
            )}
        </div>
    );
}