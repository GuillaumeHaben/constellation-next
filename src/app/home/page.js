"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HomeIcon } from "@heroicons/react/24/outline";
import ModalNewFeature from "@/components/ModalNewFeature";
import { Button } from "@heroui/react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  if (!user) return null;



  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <ModalNewFeature isOpen={isModalOpen} onOpenChange={setModalOpen} />


      <Header title={"Home"} breadcrumbs={<BreadCrumbs currentPage="home" />} icon={HomeIcon} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="mb-2">Oh! A new star is born!</p>
          <p className="mb-2">Welcome to our galaxy, {user.firstName} {user.lastName}!</p>

          <Button
            color="secondary"
            onPress={() => setModalOpen(true)}
          >
            New feature
          </Button>

        </div>
      </main>
      <Footer />
    </div>
  )
}