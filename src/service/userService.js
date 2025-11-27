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

  create: async (userData, token) => {
    const client = getClient(token);
    const res = await client.collection(RESOURCE).create({ data: userData });
    return res.data;
  },

  updateByEmail: async (email, { slug, firstName, lastName }, token) => {
    // const client = getClient(token);
    // // 1️⃣ Find user by email
    // const usersRes = await client.collection("users").find({
    //   filters: { email },
    // });

    // if (!usersRes.data || usersRes.data.length === 0) {
    //   throw new Error(`User with email ${email} not found`);
    // }
    // const userId = usersRes.data[0].id; // numeric ID of the user
    // console.log(userId);

    // // 2️⃣ Update user by ID
    // const updated = await client.collection("users").update({
    //   id: userId,
    //   data: { firstName, lastName, slug }
    // });

    // return updated;
  },

  remove: async (id, token) => {
    const client = getClient(token);
    console.log("Removing user with id:", id);
    await client.collection(RESOURCE).delete(id);
    return true;
  },
};
