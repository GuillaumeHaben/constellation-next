"use client";

import { use, useEffect, useState, useRef } from 'react';
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/service/userService";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserIcon } from "@heroicons/react/24/outline";
import { ModalUser } from "./ModalUser";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";


export default function User({ params }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (slug && token) {
      userService.getBySlug(slug, token).then(setTargetUser).catch(console.error);
    }
  }, [slug]);

  const isOwnProfile = targetUser && user && targetUser.slug === user.slug;

  const handleEditClick = () => {
    setEditForm({
      firstName: targetUser.firstName || "",
      lastName: targetUser.lastName || "",
      birthday: targetUser.birthday || null,
      country: targetUser.country || null,
      esaSite: targetUser.esaSite || null,
      address: targetUser.address || null,
      phoneNumber: targetUser.phoneNumber || null,
      instagram: targetUser.instagram || null,
      linkedin: targetUser.linkedin || null,
      facebook: targetUser.facebook || null,
      github: targetUser.github || null,
      website: targetUser.website || null,
      twitter: targetUser.twitter || null,
      directorate: targetUser.directorate || null,
      position: targetUser.position || null,
      // workDomain: targetUser.workDomain || "",
    });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");

      // 1. Upload the file
      const uploadedFile = await userService.upload(file, token, user.id);

      // 2. Update the user profile with the new image ID
      // Note: Strapi expects the ID of the uploaded file for media fields
      await userService.update(targetUser.id, { profilePicture: uploadedFile.id }, token);

      // 3. Update local state
      setTargetUser({ ...targetUser, profilePicture: uploadedFile });

    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      alert("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Header title={"User Profile"} breadcrumbs={<BreadCrumbs currentPage={"user/" + slug} targetUser={targetUser}></BreadCrumbs>} icon={UserIcon} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {targetUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <Sidebar
                  targetUser={targetUser}
                  isOwnProfile={isOwnProfile}
                  isUploading={isUploading}
                  handleFileChange={handleFileChange}
                  fileInputRef={fileInputRef}
                  handleEditClick={handleEditClick}
                />
              </div>

              {/* Right Column - Detailed Information */}
              <div className="lg:col-span-3">
                <MainContent targetUser={targetUser} />
              </div>
            </div>
          ) : (
            <p className="text-white">User profile not found.</p>
          )}
        </div>
      </main>

      <Footer />

      <ModalUser
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        targetUser={targetUser}
        setTargetUser={setTargetUser}
      />

    </div>
  );
}