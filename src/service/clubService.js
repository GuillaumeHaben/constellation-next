import { strapi } from "@strapi/client";

import { getApiBaseUrl } from "@/utils/apiHelper";

const RESOURCE = "clubs";

// Initialize a Strapi client instance
// token is passed per function call to handle dynamic auth
const getClient = (token) =>
  strapi({
    baseURL: `${getApiBaseUrl()}/api`,
    auth: token, // JWT token for authentication
  });

export const clubService = {
  getAll: async (token) => {
    const client = getClient(token);
    const clubs = await client.collection(RESOURCE).find();
    return clubs.data; // keep documentId in each object
  },

  getByDocumentId: async (documentId, token) => {
    const client = getClient(token);
    const club = await client.collection(RESOURCE).findOne({ id: documentId });
    return club;
  },

  create: async (clubData, token) => {
    const client = getClient(token);
    const newClub = await client.collection(RESOURCE).create(clubData);
    return newClub;
  },

  updateByDocumentId: async (documentId, name, description, token) => {
    const client = getClient(token);
    const updated = await client.collection(RESOURCE).update(documentId, { name, description });
    return updated;
  },

  removeByDocumentId: async (documentId, token) => {
    const client = getClient(token);
    console.log("Removing club with documentId:", documentId);
    await client.collection(RESOURCE).delete(documentId);
    return true;
  },
};

