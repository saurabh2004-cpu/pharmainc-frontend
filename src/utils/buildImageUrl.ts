/**
 * Safely constructs a full image URL from a raw path or existing URL.
 * - If path is empty/nullish → returns fallback (/default-institute.png)
 * - If path already starts with http(s) → returns as-is
 * - If path starts with / → returns as-is (relative path for Next.js public folder)
 * - Otherwise → prepends NEXT_PUBLIC_CLOUDFRONT_BASE_URL or adds https://
 */
export const buildImageUrl = (path?: string | null, fallback = '/default-institute.png'): string => {
    if (!path) return fallback;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return path; // already a relative path

    const base = process.env.NEXT_PUBLIC_CLOUDFRONT_BASE_URL;
    if (base) {
        const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
        return `${cleanBase}/${path}`;
    }

    // Fallback: assume https if no env var
    return `https://${path}`;
};
