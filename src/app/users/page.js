"use client";

import { useAuth } from "@/context/AuthContext";
import { TableUsers } from "./TableUsers";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";

export default function Users() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-full">
      <NavBar />
      <header className="relative bg-[#003247] after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
          <BreadCrumbs currentPage="users" />
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TableUsers />
        </div>
      </main>
    </div>
  )
}