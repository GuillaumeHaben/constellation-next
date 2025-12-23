import { getApiBaseUrl } from "@/utils/apiHelper";

export const authService = {
    login: async (identifier, password) => {
        try {
            const res = await fetch(`${getApiBaseUrl()}/api/auth/local`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || "Invalid credentials");
            }

            return data; // returns { jwt, user }
        } catch (error) {
            throw error;
        }
    },
};
