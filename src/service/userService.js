import { getClient, request } from "./apiBase";
import { getApiBaseUrl } from "@/utils/apiHelper";

const RESOURCE = "users";

/**
 * Internal helper to deduplicate pins for a user.
 * Prefers published versions.
 */
const deduplicateUserPins = (user) => {
  if (!user.pins) return user;
  const map = new Map();
  for (const pin of user.pins) {
    const existing = map.get(pin.documentId);
    if (!existing || (!existing.publishedAt && pin.publishedAt)) {
      map.set(pin.documentId, pin);
    }
  }
  user.pins = Array.from(map.values());
  return user;
};

/**
 * userService.js
 * Comprehensive user management, encounters, and auth status.
 * Endpoint: /api/users
 */
export const userService = {
  /**
   * Fetches all users with populated roles and pins.
   * Role: Authenticated
   */
  getAll: async (token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({
      populate: ['profilePicture', 'role', 'pins'],
      pagination: { limit: 100 }
    });
    return (res || []).map(deduplicateUserPins);
  },

  /**
   * Fetches a single user by their slug.
   * Role: Authenticated
   */
  getBySlug: async (slug, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({
      filters: { slug },
      populate: ['profilePicture']
    });
    return res?.length > 0 ? res[0] : null;
  },

  /**
   * Creates a new user entry.
   * Role: Admin
   */
  create: async (userData, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).create({ data: userData });
    return res.data;
  },

  /**
   * Updates an existing user's data.
   * Role: Owner / Admin
   */
  update: async (id, userData, token) => {
    return await request(`${RESOURCE}/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(userData),
    });
  },

  /**
   * Updates the lastSeenAt timestamp for a user.
   * Role: Owner (Heartbeat)
   */
  updateLastSeen: async (id, token) => {
    if (!id || !token) return;
    try {
      await request(`${RESOURCE}/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lastSeenAt: new Date().toISOString() }),
      });
    } catch (error) {
      console.error('Failed to update last seen:', error);
    }
  },

  /**
   * Uploads a profile picture for a user.
   * Role: Owner / Admin
   */
  upload: async (file, token, userId) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append('ref', 'plugin::users-permissions.user');
    formData.append('refId', userId);
    formData.append('field', 'profilePicture');

    const response = await fetch(`${getApiBaseUrl()}/api/upload`, {
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
   * Deletes a user profile.
   * Role: Admin
   */
  delete: async (id, token) => {
    const client = getClient(token);
    await client.collection(RESOURCE).delete(id);
    return true;
  },

  /**
   * Fetches the current authenticated user's details.
   * Role: Authenticated
   */
  getMe: async (token) => {
    return await request(`${RESOURCE}/me?populate[0]=profilePicture&populate[1]=role`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Gets total user count.
   * Role: Public / Authenticated
   */
  count: async () => {
    return await request(`${RESOURCE}/count`);
  },

  /**
   * ENCOUNTERS: Fetches a temporary token for QR encounters.
   * Role: Authenticated
   */
  getEncounterToken: async (token) => {
    return await request("qr-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * ENCOUNTERS: Validates a QR encounter token.
   * Role: Authenticated
   */
  validateEncounter: async (encounterToken, token) => {
    return await request("encounters/validate", {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ token: encounterToken }),
    });
  },

  /**
   * ENCOUNTERS: Gets total encounters for a user.
   * Role: Authenticated
   */
  getEncountersCount: async (userId, token) => {
    const res = await request(`encounters?filters[$or][0][userLow][id][$eq]=${userId}&filters[$or][1][userHigh][id][$eq]=${userId}&pagination[withCount]=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.meta.pagination.total;
  },

  /**
   * ENCOUNTERS: Fetches detailed list of users encountered.
   * Role: Authenticated
   */
  getEncounteredUsers: async (userId, token) => {
    const params = new URLSearchParams({
      'filters[$or][0][userLow][id][$eq]': String(userId),
      'filters[$or][1][userHigh][id][$eq]': String(userId),
      'populate[0]': 'userLow.profilePicture',
      'populate[1]': 'userHigh.profilePicture',
      'sort[0]': 'validatedAt:desc'
    });

    const payload = await request(`encounters?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const encounters = Array.isArray(payload?.data) ? payload.data : [];
    const seen = new Map();

    // Internal helper to extract simple user object from encounter relation
    const extractUser = (relation) => {
      const data = relation?.data || relation;
      if (!data || typeof data === 'number' || typeof data === 'string') return null;
      const attrs = data.attributes || data;
      return {
        id: data.id,
        ...attrs,
        profilePicture: attrs.profilePicture?.data?.attributes || attrs.profilePicture
      };
    };

    encounters.forEach((entry) => {
      const attrs = entry?.attributes || entry;
      const otherUser = extractUser(attrs.userLow)?.id === Number(userId)
        ? extractUser(attrs.userHigh)
        : extractUser(attrs.userLow);

      if (otherUser?.id) {
        seen.set(otherUser.id, { ...otherUser, validatedAt: attrs.validatedAt });
      }
    });

    return Array.from(seen.values());
  },

  /**
   * ENCOUNTERS: Global count for analytics.
   * Role: Admin
   */
  getTotalEncounters: async (token) => {
    const res = await request("encounters?pagination[limit]=1", { // Just need meta
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.meta?.pagination?.total ?? 0;
  },
};
