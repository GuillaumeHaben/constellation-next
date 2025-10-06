"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NavBar from "@/components/Navbar";

export default function Dashboard() {

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      const token = localStorage.getItem("token");
      if (!token) router.push("/login");
    }
  }, [user, router]);

  if (typeof user === 'undefined' || user === null) return null;

  return (
    <div className="min-h-full">
      <NavBar />

      <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <h1>Welcome, {user.username}!</h1>

        </div>
      </main>
    </div>
  )
}