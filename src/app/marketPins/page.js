"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@heroui/react";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";

export default function MarketPins() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-full">
      <NavBar />

      <header className="relative bg-[#003247] after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">MarketPins</h1>
          <BreadCrumbs currentPage="marketPins" />
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <h1>This is the place to exchange your pins!</h1>

          <p>Pins have the following rarity: Common, Rare, Epic, Legendary, Mythic.</p>

          <div className="flex gap-4 items-center mt-4">
            <Avatar className="w-20 h-20" isBordered color="default" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Gaia_mission_insignia.png/250px-Gaia_mission_insignia.png" />
            <Avatar className="w-20 h-20" isBordered color="success" src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2016/12/jwst_mission_logo/16561412-4-eng-GB/JWST_mission_logo_pillars.png" />
            <Avatar className="w-20 h-20" isBordered color="primary" src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2024/03/proba-3_mission_patch/26000821-1-eng-GB/Proba-3_mission_patch_article.png" />
            <Avatar className="w-20 h-20" isBordered color="secondary" src="https://platomission.com/wp-content/uploads/2020/01/plato_logo_320x320.png" />
            <Avatar className="w-20 h-20" isBordered color="warning" src="https://pbs.twimg.com/profile_images/1336242180483112960/NEch5hh-_400x400.jpg" />
          </div>

        </div>
      </main>
    </div>
  )
}