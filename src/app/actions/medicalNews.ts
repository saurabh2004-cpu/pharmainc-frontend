"use server";

export type MedicalNewsArticle = {
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

export type MedicalNewsResult = {
    success: boolean;
    message: string;
    articles: MedicalNewsArticle[];
};

type GNewsArticle = {
    id?: string;
    title?: string;
    description?: string | null;
    url?: string;
    image?: string | null;
    publishedAt?: string;
    source?: {
        name?: string;
        url?: string;
        country?: string;
    };
};

type GNewsResponse = {
    totalArticles?: number;
    articles?: GNewsArticle[];
    errors?: string[];
};

export async function getTrendingMedicalNews(): Promise<MedicalNewsResult> {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            message: "Medical news API key is not configured",
            articles: [],
        };
    }

    try {
        const params = new URLSearchParams({
            q: '(health OR healthcare OR hospital OR AIIMS OR ICMR OR pharmaceutical OR medicine OR nursing) AND India',
            lang: 'en',
            country: 'in',
            max: '5',
            sortby: 'publishedAt',
            apikey: apiKey,
        });

        const response = await fetch(
            `https://gnews.io/api/v4/search?${params.toString()}`,
            {
                next: {
                    revalidate: 1800,
                },
            }
        );

        const data = (await response.json()) as GNewsResponse;

        if (!response.ok) {
            console.error("GNews API error:", data);

            return {
                success: false,
                message:
                    data.errors?.[0] ||
                    "Failed to fetch medical news",
                articles: [],
            };
        }

        const articles: MedicalNewsArticle[] = (
            data.articles || []
        )
            .filter(
                (
                    article
                ): article is GNewsArticle & {
                    title: string;
                    url: string;
                    publishedAt: string;
                } =>
                    Boolean(
                        article.title &&
                        article.url &&
                        article.publishedAt
                    )
            )
            .slice(0, 5)
            .map((article, index) => ({
                id:
                    article.id ||
                    `${article.publishedAt}-${index}`,
                title: article.title,
                description: article.description || "",
                url: article.url,
                image: article.image || null,
                publishedAt: article.publishedAt,
                source: {
                    name:
                        article.source?.name ||
                        "Unknown source",
                    url: article.source?.url || null,
                    country:
                        article.source?.country || null,
                },
            }));

        return {
            success: true,
            message: "Medical news fetched successfully",
            articles,
        };
    } catch (error) {
        console.error(
            "Error fetching medical news:",
            error
        );

        return {
            success: false,
            message: "Unable to fetch medical news",
            articles: [],
        };
    }
}

// "use server";

// import { Client } from "@apitube/news-api";

// const apiKey = process.env.APITUBE_NEWS_API_KEY;

// export type MedicalNewsArticle = {
//     id: string;
//     title: string;
//     description: string;
//     url: string;
//     image: string | null;
//     publishedAt: string;
//     source: {
//         name: string;
//         domain: string | null;
//         favicon: string | null;
//     };
// };

// export type MedicalNewsResult = {
//     success: boolean;
//     message: string;
//     articles: MedicalNewsArticle[];
// };

// const getStringValue = (
//     value: unknown,
//     fallback = ""
// ): string => {
//     return typeof value === "string" ? value : fallback;
// };

// export async function getTrendingMedicalNews(): Promise<MedicalNewsResult> {
//     if (!apiKey) {
//         return {
//             success: false,
//             message: "APITUBE_NEWS_API_KEY is not configured",
//             articles: [],
//         };
//     }

//     try {
//         const client = new Client({
//             apiKey,
//         });

//         const response = await client.news("everything", {
//             "language.code": "en",
//             "country.code": "IN",
//             q: `
//         AIIMS
//         OR hospital
//         OR healthcare
//         OR healthcare jobs
//         OR nursing
//         OR medical college
//         OR pharmaceutical
//         OR ICMR
//         OR health ministry
//         OR doctor
//         OR medicine
//     `,
//             sort: "published_at",
//             per_page: 10,
//         });

//         const normalizedArticles: MedicalNewsArticle[] = response.articles
//             .map((article: any, index: number) => {
//                 /*
//                  * Convert the SDK class instances into a plain object containing
//                  * only strings, numbers, booleans, null, arrays, and plain objects.
//                  */
//                 const sourceObject =
//                     article?.source &&
//                         typeof article.source === "object"
//                         ? article.source
//                         : null;

//                 /*
//                  * Depending on the SDK version, the source title may be available
//                  * directly or nested in source.name.
//                  */
//                 const nestedSourceName =
//                     sourceObject?.name &&
//                         typeof sourceObject.name === "object"
//                         ? sourceObject.name
//                         : null;

//                 const sourceName =
//                     getStringValue(sourceObject?.name) ||
//                     getStringValue(nestedSourceName?.name) ||
//                     getStringValue(sourceObject?.domain) ||
//                     "Unknown source";

//                 const sourceDomain =
//                     getStringValue(sourceObject?.domain) || null;

//                 const sourceFavicon =
//                     getStringValue(sourceObject?.favicon) || null;

//                 const id =
//                     getStringValue(article?.id) ||
//                     String(article?.id ?? article?.url ?? index);

//                 const title = getStringValue(article?.title);
//                 const url = getStringValue(article?.url);
//                 const publishedAt =
//                     getStringValue(article?.publishedAt) ||
//                     getStringValue(article?.published_at);

//                 return {
//                     id,
//                     title,
//                     description: getStringValue(
//                         article?.description
//                     ),
//                     url,
//                     image:
//                         getStringValue(article?.image) ||
//                         getStringValue(article?.imageUrl) ||
//                         getStringValue(article?.image_url) ||
//                         null,
//                     publishedAt,
//                     source: {
//                         name: sourceName,
//                         domain: sourceDomain,
//                         favicon: sourceFavicon,
//                     },
//                 };
//             })
//             .filter((article) => {
//                 return (
//                     Boolean(article.title) &&
//                     Boolean(article.url) &&
//                     Boolean(article.publishedAt)
//                 );
//             })
//             .slice(0, 5);

//         return {
//             success: true,
//             message: "Medical news fetched successfully",
//             articles: normalizedArticles,
//         };
//     } catch (error) {
//         console.error("Medical news error:", error);

//         return {
//             success: false,
//             message: "Failed to fetch medical news",
//             articles: [],
//         };
//     }
// }