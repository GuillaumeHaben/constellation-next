import { request } from "./apiBase";

/**
 * authService.js
 * Handles user authentication and session management.
 * Endpoint: /api/auth
 */
export const authService = {
    /**
     * Authenticates a user with identifier and password.
     * Role: Public
     * @param {string} identifier - Email or username.
     * @param {string} password - User password.
     * @returns {Promise<Object>} { jwt, user }
     */
    login: async (identifier, password) => {
        return await request("auth/local", {
            method: "POST",
            body: JSON.stringify({ identifier, password }),
        });
    },
};
