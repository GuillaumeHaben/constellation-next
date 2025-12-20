import { strapi } from "@strapi/client";

const RESOURCE = "pins";

// Initialize a Strapi client instance for GET requests (keeping it for convenient filtering/population)
const getClient = (token) =>
    strapi({
        baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
        auth: token,
    });

// Helper for write operations to ensure consistent error handling and headers
const apiRequest = async (endpoint, method, body, token) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body ? JSON.stringify({ data: body }) : undefined,
        });

        if (response.status === 204) {
            return null;
        }

        const text = await response.text();
        const res = text ? JSON.parse(text) : {};

        if (!response.ok) {
            console.error(`${method} ${endpoint} Error:`, JSON.stringify(res, null, 2));
            throw new Error(res.error?.message || `Failed to ${method} ${endpoint}`);
        }

        return res.data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.error("Network error or API unreachable");
            throw new Error("Network error: Please check your connection or server status.");
        }
        throw error;
    }
};

export const pinService = {
    // Public/User: Get all approved pins (Library)
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

    // Public/User: Get pins owned by a specific user
    getUserPins: async (userId, token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            filters: { users: { id: userId } },
            populate: ['image'],
            pagination: { limit: 100 }
        });
        return res.data;
    },

    // Crew: Suggest a new pin
    suggestPin: async (data, token) => {
        const payload = {
            status: 'pending', // Default
            ...data,
            publishedAt: new Date(), // Ensure it's not a draft
        };
        return await apiRequest(RESOURCE, 'POST', payload, token);
    },

    // User: Add a pin to a user profile (Many-to-Many connect)
    equipPin: async (pinId, userId, token) => {
        const payload = {
            users: {
                connect: [userId]
            }
        };
        return await apiRequest(`${RESOURCE}/${pinId}`, 'PUT', payload, token);
    },

    // User: Remove a pin from a user profile (Many-to-Many disconnect)
    unequipPin: async (pinId, userId, token) => {
        const payload = {
            users: {
                disconnect: [userId]
            }
        };
        return await apiRequest(`${RESOURCE}/${pinId}`, 'PUT', payload, token);
    },

    // Admin: Get pending pins
    getPendingPins: async (token) => {
        const client = getClient(token);
        const res = await client.collection(RESOURCE).find({
            filters: { status: "pending" },
            populate: ['image', 'suggestedBy'],
            sort: ['createdAt:desc']
        });
        return res.data;
    },

    // Admin: Approve flow
    approvePin: async (pinId, token) => {
        return await apiRequest(`${RESOURCE}/${pinId}`, 'PUT', { status: 'approved' }, token);
    },

    // Admin: Reject flow (Deletes the suggestion)
    rejectPin: async (pinId, token) => {
        return await apiRequest(`${RESOURCE}/${pinId}`, 'DELETE', null, token);
    },
};
