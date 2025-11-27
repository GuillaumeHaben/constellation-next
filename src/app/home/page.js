"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";

export default function Home() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-full">
      <NavBar />

      <header className="relative bg-[#003247] after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Home</h1>
          <BreadCrumbs currentPage="home" />
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p>Oh! A new star is born!</p>
          <p>Welcome to our galaxy, {user.firstName} {user.lastName}!</p>
        </div>
      </main>
    </div>
  )
}