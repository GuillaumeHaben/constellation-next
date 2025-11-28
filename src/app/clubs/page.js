"use client";

import { useAuth } from "@/context/AuthContext";
import { TableClubs } from "./TableClubs";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Clubs() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Header title={"Clubs"} breadcrumbs={<BreadCrumbs currentPage="clubs" />} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TableClubs />
        </div>
      </main>
      <Footer />
    </div>
  )
}