import { getClient, request } from "./apiBase";

const RESOURCE = "changelogs";

/**
 * changelogService.js
 * Handles system changelogs and release notes.
 * Endpoint: /api/changelogs
 */
export const changelogService = {
    /**
     * Fetches all changelogs.
     * Role: Authenticated
     */
    getAll: async (token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            sort: 'createdAt:desc'
        });
        return res.data;
    },

    /**
     * Fetches the single latest changelog.
     * Role: Authenticated
     */
    getLatest: async (token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            sort: 'date:desc',
            pagination: { limit: 1 }
        });
        return res.data.length > 0 ? res.data[0] : null;
    },

    /**
     * Creates a new changelog entry.
     * Role: Admin
     */
    create: async (token, data) => {
        return await request(RESOURCE, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data }),
        });
    },

    /**
     * Deletes a changelog entry.
     * Role: Admin
     */
    delete: async (token, documentId) => {
        return await request(`${RESOURCE}/${documentId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};
