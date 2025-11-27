import { strapi } from "@strapi/client";

const RESOURCE = "users";

// Initialize a Strapi client instance
// token is passed per function call to handle dynamic auth
const getClient = (token) =>
  strapi({
    baseURL: "http://localhost:1337/api", //process.env.NEXT_PUBLIC_API_URL || 
    auth: token, // JWT token for authentication
  });

export const userService = {
  getAll: async (token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find();
    return res; // array of users with documentId, id, attributes
  },

  getUserById: async (userId, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).findOne({ id: userId });
    return res; // single user object
  },

  getByEmailAddress: async (email, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({ filters: { email } });
    return res.data.length > 0 ? res.data[0] : null;
  },

  getBySlug: async (slug, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({ filters: { slug } });
    return res.data.length > 0 ? res.data[0] : null;
  },

  create: async (userData, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).create({ data: userData });
    return res.data;
  },

  update: async (id, userData, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).update(id, { data: userData });
    return res.data;
  },

  remove: async (id, token) => {
    const client = getClient(token);
    console.log("Removing user with id:", id);
    await client.collection(RESOURCE).delete(id);
    return true;
  },
};
