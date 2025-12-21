"use client";

import { useAuth } from "@/context/AuthContext";
import BreadCrumbs from "@/components/BreadCrumbs";
import NavBar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Quote from "@/components/Quote";
import HeatMap from "./HeatMap";
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

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 to-transparent p-6 rounded-2xl border border-blue-500/10">
                        <div>
                            <p className="text-base text-gray-400 tracking-tight">You are free to indicate where you live in your profile. If you do so, the precise address is securely stored on our servers. Aggregating addresses from all of us allow the display of a global map. This helps us, especially newcomers, realise where Young ESA usually find places where to rent</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Quote text="I wisely started with a map, and made the story fit" author="J.R.R. Tolkien" authorTitle="Writer, poet & philologist" picture="/img/jrr-tolkien.jpg" />
                    </div>

                    <div className="mt-6">
                        <HeatMap />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}