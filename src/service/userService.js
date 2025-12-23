import { strapi } from "@strapi/client";
import { getApiBaseUrl } from "@/utils/apiHelper";

const RESOURCE = "users";

// Initialize a Strapi client instance
// token is passed per function call to handle dynamic auth
const getClient = (token) => {
  const baseURL = `${getApiBaseUrl()}/api`;
  // console.log(`[DEBUG] getClient baseURL: ${baseURL}`);
  return strapi({
    baseURL,
    auth: token, // JWT token for authentication
  });
};

export const userService = {
  getAll: async (token) => {
    try {
      const client = getClient(token);
      const res = await client.collection(RESOURCE).find({
        populate: ['profilePicture', 'role'],
        pagination: {
          limit: 100
        }
      });
      console.log(`[DEBUG] getAll users res:`, res?.length || 0, 'users found');
      return res;
    } catch (error) {
      console.error(`[DEBUG] getAll users error:`, error);
      return [];
    }
  },

  getUserById: async (userId, token) => {
    // ...
  },

  getByEmailAddress: async (email, token) => {
    // ...
  },

  getBySlug: async (slug, token) => {
    console.log(`[DEBUG] getBySlug called for slug: ${slug}`);
    try {
      const client = getClient(token);
      const res = await client.collection(RESOURCE).find({ filters: { slug }, populate: ['profilePicture'] });
      console.log(`[DEBUG] getBySlug result:`, res);
      if (!res) { return null };
      return res.length > 0 ? res[0] : null;
    } catch (error) {
      console.error(`[DEBUG] getBySlug error:`, error);
      return null;
    }
  },

  create: async (userData, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).create({ data: userData });
    return res.data;
  },

  update: async (id, userData, token) => {
    // For users, we need to use the direct API endpoint, not the collection method
    const response = await fetch(`${getApiBaseUrl()}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Update failed:', error);
      throw new Error(error.error?.message || 'Failed to update user');
    }

    const data = await response.json();
    console.log('Update successful:', data);
    return data;
  },

  upload: async (file, token, userId) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append('ref', 'plugin::users-permissions.user'); // user model
    formData.append('refId', userId);
    formData.append('field', 'profilePicture');

    const response = await fetch(`${getApiBaseUrl()}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Upload failed:", error);
      throw new Error(error.error?.message || "Failed to upload file");
    }

    const data = await response.json();
    return data[0]; // Strapi returns an array of uploaded files
  },

  remove: async (id, token) => {
    const client = getClient(token);
    await client.collection(RESOURCE).delete(id);
    return true;
  },

  getMe: async (token) => {
    const response = await fetch(`${getApiBaseUrl()}/api/users/me?populate[0]=profilePicture&populate[1]=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return null; // or throw, but existing code returns null on error
    }
    return await response.json();
  },

  count: async () => {
    const response = await fetch(`${getApiBaseUrl()}/api/users/count`);
    if (!response.ok) {
      throw new Error('Failed to fetch user count');
    }
    const count = await response.json();
    return count; // Strapi usually returns the number directly for this endpoint
  },

  getEncounterToken: async (token) => {
    const response = await fetch(`${getApiBaseUrl()}/api/qr-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch QR token');
    }
    return await response.json();
  },

  validateEncounter: async (encounterToken, token) => {
    const response = await fetch(`${getApiBaseUrl()}/api/encounters/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token: encounterToken }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to validate encounter');
    }
    return await response.json();
  },

  getEncountersCount: async (userId, token) => {
    const response = await fetch(`${getApiBaseUrl()}/api/encounters?filters[$or][0][userLow][id][$eq]=${userId}&filters[$or][1][userHigh][id][$eq]=${userId}&pagination[withCount]=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch encounters count');
    }
    const data = await response.json();
    return data.meta.pagination.total;
  },
  getEncounteredUsers: async (userId, token) => {
    const params = new URLSearchParams();
    params.append('filters[$or][0][userLow][id][$eq]', String(userId));
    params.append('filters[$or][1][userHigh][id][$eq]', String(userId));
    params.append('populate[0]', 'userLow.profilePicture');
    params.append('populate[1]', 'userHigh.profilePicture');
    params.append('sort[0]', 'validatedAt:desc');

    const response = await fetch(`${getApiBaseUrl()}/api/encounters?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch encountered users');
    }

    const payload = await response.json();
    const encounters = Array.isArray(payload?.data) ? payload.data : [];

    const seen = new Map();
    const missingDetails = new Set();

    const extractProfilePicture = (raw) => {
      if (!raw) return null;
      const dataNode = raw.data ?? raw;
      if (!dataNode) return null;
      if (dataNode.attributes) {
        const { url, alternativeText, name } = dataNode.attributes;
        return { url, alternativeText, name };
      }
      return dataNode.url ? { url: dataNode.url } : null;
    };

    const extractUser = (relation) => {
      if (!relation) return null;

      if (relation.data) {
        return extractUser(relation.data);
      }

      if (typeof relation === 'number' || typeof relation === 'string') {
        const numericId = Number(relation);
        return Number.isFinite(numericId) ? { id: numericId } : null;
      }

      const attributes = relation.attributes ?? {};
      const id = relation.id ?? attributes.id;
      if (id == null) return null;

      return {
        id: Number(id),
        firstName: attributes.firstName,
        lastName: attributes.lastName,
        username: attributes.username,
        slug: attributes.slug,
        profilePicture: extractProfilePicture(attributes.profilePicture ?? relation.profilePicture),
      };
    };

    encounters.forEach((entry) => {
      const attrs = entry?.attributes || entry || {};
      const userLow = extractUser(attrs.userLow);
      const userHigh = extractUser(attrs.userHigh);

      const normalizedUserId = Number(userId);
      const otherUser = userLow?.id === normalizedUserId ? userHigh : userLow;

      if (!otherUser?.id) return;

      const summary = {
        id: otherUser.id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        username: otherUser.username,
        slug: otherUser.slug,
        profilePicture: otherUser.profilePicture ?? null,
        validatedAt: attrs.validatedAt,
      };

      if (!summary.firstName && !summary.lastName && !summary.username) {
        missingDetails.add(otherUser.id);
      }

      seen.set(otherUser.id, summary);
    });

    if (missingDetails.size > 0) {
      const detailResponses = await Promise.all(
        Array.from(missingDetails).map(async (id) => {
          try {
            const res = await fetch(`${getApiBaseUrl()}/api/users/${encodeURIComponent(id)}?populate[0]=profilePicture`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!res.ok) return null;
            const detail = await res.json();
            return { id, detail };
          } catch (error) {
            console.error('Failed to fetch user detail for encounter:', error);
            return null;
          }
        })
      );

      detailResponses.forEach((entry) => {
        if (!entry) return;
        const existing = seen.get(entry.id);
        if (!existing) return;

        const detail = entry.detail ?? {};
        const enrichedProfilePicture = detail.profilePicture
          ? extractProfilePicture(detail.profilePicture)
          : existing.profilePicture;

        seen.set(entry.id, {
          ...existing,
          firstName: detail.firstName ?? existing.firstName,
          lastName: detail.lastName ?? existing.lastName,
          username: detail.username ?? existing.username,
          slug: detail.slug ?? existing.slug,
          profilePicture: enrichedProfilePicture,
        });
      });
    }

    return Array.from(seen.values());
  },

  getTotalEncounters: async (token) => {
    const response = await fetch(`${getApiBaseUrl()}/api/encounters?pagination[withCount]=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch total encounters');
    }
    const data = await response.json();
    return data.meta?.pagination?.total ?? 0;
  },
};
