"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HomeIcon } from "@heroicons/react/24/outline";
import ModalNewFeature from "@/components/ModalNewFeature";
import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { userService } from "@/service/userService";
import { changelogService } from "@/service/changelogService";
import ModalReleaseNotes from "./ModalReleaseNotes";

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
      <ModalNewFeature isOpen={isModalOpen} onOpenChange={setModalOpen} />
      <ModalReleaseNotes
        isOpen={isReleaseNotesOpen}
        onClose={handleCloseReleaseNotes}
        changelog={releaseNotes}
      />

      <Header title={"Home"} breadcrumbs={<BreadCrumbs currentPage="home" />} icon={HomeIcon} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="mb-2">Oh! A new star is born!</p>
          <p className="mb-2">Welcome to our galaxy, {user.firstName} {user.lastName}!</p>

          <Button
            color="secondary"
            onPress={() => setModalOpen(true)}
            className="mb-2"
          >
            New feature
          </Button>
          <p className="mb-2">
            Among the stats I want:<br />
            - User with the most pin<br />
            - Country most represented<br />
            - Language most spoken<br />
            - Site most represented<br />
            - Directorate / Position (however not proportional, sad)<br />
            - Number of registered users<br />
            - Number of users registered in the last 7 days<br />
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}