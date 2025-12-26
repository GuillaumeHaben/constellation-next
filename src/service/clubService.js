import { getClient } from "./apiBase";

const RESOURCE = "clubs";

/**
 * clubService.js
 * Handles crew clubs and organizations.
 * Endpoint: /api/clubs
 */
export const clubService = {
  /**
   * Fetches all clubs.
   * Role: Authenticated
   */
  getAll: async (token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find();
    return res.data;
  },

  /**
   * Fetches a specific club by documentId.
   * Role: Authenticated
   */
  getById: async (documentId, token) => {
    const client = getClient(token);
    return await client.collection(RESOURCE).findOne({ id: documentId });
  },

  /**
   * Creates a new club.
   * Role: Authenticated / Admin
   */
  create: async (clubData, token) => {
    const client = getClient(token);
    return await client.collection(RESOURCE).create(clubData);
  },

  /**
   * Updates an existing club.
   * Role: Authenticated (Owner) / Admin
   */
  update: async (documentId, name, description, token) => {
    const client = getClient(token);
    return await client.collection(RESOURCE).update(documentId, { name, description });
  },

  /**
   * Deletes a club.
   * Role: Authenticated (Owner) / Admin
   */
  delete: async (documentId, token) => {
    const client = getClient(token);
    await client.collection(RESOURCE).delete(documentId);
    return true;
  },
};

