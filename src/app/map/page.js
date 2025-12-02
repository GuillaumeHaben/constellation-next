"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import HeatMap from "./HeatMap";
import Footer from "@/components/Footer";
import { MapIcon } from "@heroicons/react/24/outline";

export default function Map() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <Header title={"Map"} breadcrumbs={<BreadCrumbs currentPage="Map" />} icon={MapIcon} />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mb-6">

                    <h1>This is the map.</h1>

                    <p className="mt-4">You are free to indicate where you live in your profile. If you do so, the precise address is securely stored on our servers. Aggregating addresses from all of us allow the display of a global map. This helps us, especially newcomers, realise where Young ESA usually find places where to rent.</p>

                </div>
                <HeatMap />
            </main>
            <Footer />
        </div>
    )
}