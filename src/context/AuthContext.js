"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "@/service/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = async (token, userData) => {
        localStorage.setItem("token", token);
        // Set immediate user for optimistic UI
        setUser(userData);
        // Attempt enrichment with populated media and role
        const enriched = await userService.getMe(token);
        if (enriched) setUser(enriched);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        userService.getMe(token)
            .then((data) => setUser(data))
            .catch(() => setUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
