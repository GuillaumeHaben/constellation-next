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
    if (!res || !res.data) return null;
    return res.data.length > 0 ? res.data[0] : null;
  },

  getBySlug: async (slug, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({ filters: { slug } });
    if (!res) { return null };
    return res.length > 0 ? res[0] : null;
  },

  create: async (userData, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).create({ data: userData });
    return res.data;
  },

  update: async (id, userData, token) => {
    // For users, we need to use the direct API endpoint, not the collection method
    const response = await fetch(`http://localhost:1337/api/users/${id}`, {
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

  remove: async (id, token) => {
    const client = getClient(token);
    await client.collection(RESOURCE).delete(id);
    return true;
  },
};
