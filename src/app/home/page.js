"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HomeIcon } from "@heroicons/react/24/outline";
import ModalNewFeature from "@/components/ModalNewFeature";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { userService } from "@/service/userService";
import { changelogService } from "@/service/changelogService";
import ModalReleaseNotes from "./ModalReleaseNotes";
import DashboardHome from "./components/DashboardHome";
import Quote from "@/components/Quote";

export default function Home() {
  const { user } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState(null);
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);

  useEffect(() => {
    const checkReleaseNotes = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const changelogs = await changelogService.getAll(token);

        if (changelogs && changelogs.length > 0) {
          // Filter out bug fixes, we only celebrate features
          const features = changelogs.filter(item => item.tag !== 'bug-fix');

          if (features.length > 0) {
            const latest = features[0];

            // Use createdAt for precise comparison (Strapi 'date' field might truncate time)
            const latestTimestamp = new Date(latest.createdAt); // System creation time
            const lastSeenDate = user.lastSeenChangelogAt ? new Date(user.lastSeenChangelogAt) : null;

            if (!lastSeenDate || lastSeenDate < latestTimestamp) {
              setReleaseNotes(latest);
              setIsReleaseNotesOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check release notes:", error);
      }
    };

    checkReleaseNotes();
  }, [user]);

  const handleCloseReleaseNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      await userService.update(user.id, { lastSeenChangelogAt: new Date().toISOString() }, token);
      setIsReleaseNotesOpen(false);
    } catch (error) {
      console.error("Failed to update last seen changelog:", error);
      setIsReleaseNotesOpen(false); // Close anyway so user isn't stuck
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <ModalReleaseNotes
        isOpen={isReleaseNotesOpen}
        onClose={handleCloseReleaseNotes}
        changelog={releaseNotes}
      />

      <Header title={"Home"} breadcrumbs={<BreadCrumbs currentPage="home" />} icon={HomeIcon} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <Quote text="We are all of us stars, and we deserve to twinkle" author="Marilyn Monroe" authorTitle="Hollywood Icon" picture="/img/marilyn-monroe.jpg" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 to-transparent p-6 rounded-2xl border border-blue-500/10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Welcome to the Galaxy, <span className="text-cyan-600"> {user.firstName}</span>!</h2>
              <p className="text-base text-gray-400 tracking-tight w-2/3">Constellation connects Young Professionals at ESA, helping them discover peers, share the pride behind their initiatives, and build a lasting community beyond their mission.</p>
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Community Insights</h3>
            </div>
            <DashboardHome />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}