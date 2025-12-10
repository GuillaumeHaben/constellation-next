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
            sort: 'date:desc'
        });
        return changelogs.data; // keep documentId in each object
    },
};
