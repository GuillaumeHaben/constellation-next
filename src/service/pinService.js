import { getClient, request } from "./apiBase";

const RESOURCE = "pins";

/**
 * pinService.js
 * Handles pin library, user collections, and approval workflow.
 * Endpoint: /api/pins
 */
export const pinService = {
    /**
     * Fetches all approved pins for the library.
     * Role: Authenticated
     */
    getAllApproved: async (token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            filters: { status: "approved" },
            populate: ['image'],
            sort: ['name:asc'],
            pagination: { limit: 100 }
        });
        return res.data;
    },

    /**
     * Checks if a pin name already exists (case-insensitive).
     * Role: Authenticated
     */
    findByName: async (name, token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            filters: { name: { $eqi: name } },
            pagination: { limit: 1 }
        });
        return res.data && res.data.length > 0 ? res.data[0] : null;
    },

    /**
     * Fetches pins owned by a specific user.
     * Role: Authenticated
     */
    getUserPins: async (userId, token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            filters: { users: { id: userId } },
            populate: ['image'],
            pagination: { limit: 100 }
        });
        return res.data;
    },

    /**
     * Submits a new pin suggestion.
     * Role: Authenticated (Crew)
     */
    suggestPin: async (data, token) => {
        const payload = {
            status: 'pending',
            ...data,
            publishedAt: new Date(),
        };
        return await request(RESOURCE, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data: payload }),
        });
    },

    /**
     * Uploads an image for a pin suggestion.
     * Role: Authenticated
     */
    uploadImage: async (file, token) => {
        const formData = new FormData();
        formData.append("files", file);

        const response = await fetch(`${request("").url.replace('/api/', '/api/upload')}`, { // Helper for upload endpoint
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Failed to upload file");
        }

        const data = await response.json();
        return data[0];
    },

    /**
     * Connects a pin to a user profile.
     * Role: Authenticated / Admin
     */
    equipPin: async (pinId, userId, token) => {
        const payload = { users: { connect: [userId] } };
        return await request(`${RESOURCE}/${pinId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data: payload }),
        });
    },

    /**
     * Disconnects a pin from a user profile.
     * Role: Authenticated / Admin
     */
    unequipPin: async (pinId, userId, token) => {
        const payload = { users: { disconnect: [userId] } };
        return await request(`${RESOURCE}/${pinId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data: payload }),
        });
    },

    /**
     * Fetches all pending pin suggestions.
     * Role: Admin
     */
    getPendingPins: async (token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            filters: { status: "pending" },
            populate: ['image', 'suggestedBy'],
            sort: ['createdAt:desc']
        });
        return res.data;
    },

    /**
     * Approves a pin suggestion.
     * Role: Admin
     */
    approve: async (pinId, token) => {
        return await request(`${RESOURCE}/${pinId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data: { status: 'approved' } }),
        });
    },

    /**
     * Deletes (rejects) a pin suggestion.
     * Role: Admin
     */
    delete: async (pinId, token) => {
        return await request(`${RESOURCE}/${pinId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};
