"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import profilePicture from '@/../public/guillaume.jpg';


export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-full">
      <NavBar />
      <header className="relative bg-[#003247] after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">My profile</h1>
        </div>
      </header>
      <main>

      </main>
    </div>
  )
}