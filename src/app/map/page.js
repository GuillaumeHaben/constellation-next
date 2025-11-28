"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import HeatMap from "./HeatMap";

export default function Map() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="min-h-full">
            <NavBar />

            <header className="relative bg-[#003247] after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Map</h1>
                    <BreadCrumbs currentPage="Map" />
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                    <h1>This is the map.</h1>

                    <p className="mt-4">You are free to indicate where you live in your profile. If you do so, the precise address is securely stored on our servers. Aggregating addresses from all of us allow the display of a global map. This helps us, especially newcomers, realise where Young ESA usually find places where to rent.</p>

                    <HeatMap />
                </div>
            </main>
        </div>
    )
}