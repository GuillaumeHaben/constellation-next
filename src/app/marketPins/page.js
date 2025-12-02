"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@heroui/react";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function MarketPins() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <Header title={"Market Pins"} breadcrumbs={<BreadCrumbs currentPage="marketPins" />} icon={ShoppingBagIcon} />
      <main className="flex-1">
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
      <Footer />
    </div>
  )
}