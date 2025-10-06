"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      const token = localStorage.getItem("token");
      if (!token) router.push("/login");
    }
  }, [user, router]);

  if (typeof user === "undefined" || user === null) return null;

  return children;
}