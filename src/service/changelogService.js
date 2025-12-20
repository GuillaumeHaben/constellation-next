import { strapi } from "@strapi/client";

const RESOURCE = "changelogs";

// Initialize a Strapi client instance
// token is passed per function call to handle dynamic auth
const getClient = (token) =>
    strapi({
        baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
        auth: token, // JWT token for authentication
    });

export const changelogService = {
    getAll: async (token) => {
        const client = getClient(token);
        // Sort by date descending (newest first)
        const changelogs = await client.collection(RESOURCE).find({
            sort: 'createdAt:desc'
        });
        return changelogs.data; // keep documentId in each object
    },

    getLatest: async (token) => {
        const client = getClient(token);
        const changelogs = await client.collection(RESOURCE).find({
            sort: 'date:desc',
            'pagination[limit]': 1
        });
        return changelogs.data.length > 0 ? changelogs.data[0] : null;
    },

    create: async (token, data) => {
        console.log("Submitting changelog data:", data);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/changelogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Strapi Error Details:", error);
            throw new Error(error.error?.message || "Failed to create changelog");
        }

        const res = await response.json();
        return res.data;
    },

    delete: async (token, documentId) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/changelogs/${documentId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Strapi Error Details:", error);
            throw new Error(error.error?.message || "Failed to delete changelog");
        }
        return true;
    },
};
