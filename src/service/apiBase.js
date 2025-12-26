import { strapi } from "@strapi/client";
import { getApiBaseUrl } from "@/utils/apiHelper";

/**
 * apiBase.js
 * Centralizes authentication and base API logic for all services.
 */

const BASE_URL = `${getApiBaseUrl()}/api`;

/**
 * Initializes a Strapi Client for a specific collection.
 * @param {string} token - User's JWT token.
 * @returns {Object} Strapi client instance.
 */
export const getClient = (token) => {
    return strapi({
        baseURL: BASE_URL,
        auth: token,
    });
};

/**
 * Standardized fetch wrapper for non-standard Strapi routes (e.g., /users, /auth).
 * Handles response parsing and error extraction.
 * @param {string} endpoint - API endpoint (e.g., 'users/me').
 * @param {Object} options - Fetch options (method, headers, body).
 * @returns {Promise<any>} Parsed JSON response.
 */
export const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (response.status === 204) return null;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.error?.message || `API request failed: ${response.status}`;
        throw new Error(message);
    }

    return data;
};
