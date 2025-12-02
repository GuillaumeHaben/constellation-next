"use client";

import { useAuth } from "@/context/AuthContext";
import { TableUsers } from "./TableUsers";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UsersIcon } from "@heroicons/react/24/outline";

export default function Users() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Header title={"Users"} breadcrumbs={<BreadCrumbs currentPage="users" />} icon={UsersIcon} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TableUsers />
        </div>
      </main>
      <Footer />
    </div>
  )
}