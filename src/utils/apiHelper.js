export const getApiBaseUrl = () => {
    // Server-side
    if (typeof window === "undefined") {
        // 1. In Docker Prod, we want to use the internal container URL
        // We check for DOCKER_RUNTIME (set in Dockerfile) or HOSTNAME
        if (process.env.DOCKER_RUNTIME || process.env.HOSTNAME === '0.0.0.0') {
            return "http://strapi:1337";
        }
        // 2. In Local Dev, we want to use the public URL (usually localhost)
        if (process.env.NEXT_PUBLIC_API_URL) {
            return process.env.NEXT_PUBLIC_API_URL;
        }
        // 3. Fallback
        return "http://127.0.0.1:1337";
    }

    // Client-side
    // If a public API URL is explicitly set (e.g. for local dev or custom domain), use it.
    // Otherwise (e.g. Quick Tunnel), use the current origin to rely on rewrites.
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    return window.location.origin;
};
