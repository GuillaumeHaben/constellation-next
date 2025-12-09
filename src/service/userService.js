import { strapi } from "@strapi/client";

const RESOURCE = "users";

// Initialize a Strapi client instance
// token is passed per function call to handle dynamic auth
const getClient = (token) =>
  strapi({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    auth: token, // JWT token for authentication
  });

export const userService = {
  getAll: async (token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({
      populate: ['profilePicture'],
      pagination: {
        limit: 100 // Fetch up to 100 users to ensure client-side sorting works for a reasonable set
      }
    });
    return res; // array of users with documentId, id, attributes
  },

  getUserById: async (userId, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).findOne({ id: userId, populate: ['profilePicture'] });
    return res; // single user object
  },

  getByEmailAddress: async (email, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({ filters: { email }, populate: ['profilePicture'] });
    if (!res || !res.data) return null;
    return res.data.length > 0 ? res.data[0] : null;
  },

  getBySlug: async (slug, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).find({ filters: { slug }, populate: ['profilePicture'] });
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
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
};
