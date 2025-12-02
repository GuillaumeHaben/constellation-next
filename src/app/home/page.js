"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <Header title={"Home"} breadcrumbs={<BreadCrumbs currentPage="home" />} icon={HomeIcon} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p>Oh! A new star is born!</p>
          <p>Welcome to our galaxy, {user.firstName} {user.lastName}!</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}