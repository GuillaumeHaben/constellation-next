"use client";

import { useAuth } from "@/context/AuthContext";
import { TableUsers } from "./TableUsers";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UsersIcon } from "@heroicons/react/24/outline";
import Quote from "@/components/Quote";

export default function Users() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Header title={"Users"} breadcrumbs={<BreadCrumbs currentPage="users" />} icon={UsersIcon} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="mt-6">
            <TableUsers />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}