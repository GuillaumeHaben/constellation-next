import { getClient, request } from "./apiBase";

const RESOURCE = "awards";

/**
 * awardService.js
 * Handles award library and user achievements.
 * Endpoint: /api/awards
 */
export const awardService = {
    /**
     * Fetches all available awards.
     * Role: Authenticated
     */
    getAll: async (token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            sort: ['category:asc', 'id:asc'],
            pagination: { limit: 100 }
        });
        return res.data;
    },

    /**
     * Fetches awards earned by a specific user.
     * Role: Authenticated
     */
    getUserAwards: async (userId, token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            filters: { users: { id: userId } },
            pagination: { limit: 100 }
        });
        return res.data;
    },


    /**
     * Create an award (Admin only).
     * Role: Admin
     */
    create: async (data, token) => {
        return await request(RESOURCE, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data }),
        });
    },

    /**
     * Update an award (Admin only).
     * Role: Admin
     */
    update: async (documentId, data, token) => {
        return await request(`${RESOURCE}/${documentId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data }),
        });
    },

    /**
     * Delete an award (Admin only).
     * Role: Admin
     */
    delete: async (documentId, token) => {
        return await request(`${RESOURCE}/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};
