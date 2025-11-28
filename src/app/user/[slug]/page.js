"use client";

import { use, useEffect, useState, useRef } from 'react';
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/service/userService";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PencilIcon, CameraIcon } from "@heroicons/react/24/solid";
import { ModalUser } from "./ModalUser";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import ProgressBar from "./progressBar";
import { getProfilePictureUrl } from "@/utils/media";
import { InstagramIcon, LinkedInIcon, FacebookIcon, GitHubIcon, TwitterIcon, WebsiteIcon } from "@/components/Icons";

const COUNTRY_EMOJIS = {
  "Austria": "🇦🇹",
  "Belgium": "🇧🇪",
  "Czech Republic": "🇨🇿",
  "Denmark": "🇩🇰",
  "Estonia": "🇪🇪",
  "Finland": "🇫🇮",
  "France": "🇫🇷",
  "Germany": "🇩🇪",
  "Greece": "🇬🇷",
  "Hungary": "🇭🇺",
  "Ireland": "🇮🇪",
  "Italy": "🇮🇹",
  "Luxembourg": "🇱🇺",
  "Netherlands": "🇳🇱",
  "Norway": "🇳🇴",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Romania": "🇷🇴",
  "Slovenia": "🇸🇮",
  "Spain": "🇪🇸",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "United Kingdom": "🇬🇧"
};


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
      <Header title={"Profile"} breadcrumbs={<BreadCrumbs currentPage={"user/" + slug} targetUser={targetUser}></BreadCrumbs>} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {targetUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <Card className="bg-white/5 border border-white/10 ">
                  <CardBody className="flex flex-col items-center gap-4 p-6">
                    <div className="relative">
                      <Avatar
                        src={getProfilePictureUrl(targetUser)}
                        className="w-32 h-32"
                        isBordered
                        radius="full"
                        color="default"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <Spinner color="white" />
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white">
                        {targetUser.firstName} {targetUser.lastName}
                      </h2>
                      <p className="text-gray-400 mt-1">{targetUser.position || "ESA Member"}, {targetUser.esaSite || "ESA"}</p>
                    </div>
                    {isOwnProfile && (
                      <>
                        <ProgressBar targetUser={targetUser} />

                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />

                        <div className="flex gap-2 w-full mt-2">
                          <Button
                            color="secondary"
                            variant="flat"
                            startContent={<CameraIcon className="w-4 h-4" />}
                            onPress={() => fileInputRef.current?.click()}
                            className="flex-1"
                            isDisabled={isUploading}
                          >
                            Picture
                          </Button>
                          <Button
                            color="primary"
                            variant="flat"
                            startContent={<PencilIcon className="w-4 h-4" />}
                            onPress={handleEditClick}
                            className="flex-1"
                          >
                            Edit
                          </Button>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </div>

              {/* Right Column - Detailed Information */}
              <div className="lg:col-span-3">
                <Card className="bg-white/5 border border-white/10">
                  <CardBody className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileField label="Birthday" value={targetUser.birthday} />
                      <ProfileField label="Country" value={targetUser.country ? COUNTRY_EMOJIS[targetUser.country] + " " + targetUser.country : null} />
                      <ProfileField label="ESA Site" value={targetUser.esaSite} />
                      <ProfileField label="Directorate" value={targetUser.directorate} />
                      <ProfileField label="Position" value={targetUser.position} />
                      {/* <ProfileField label="Work Domain" value={targetUser.workDomain} /> */}
                      <ProfileField label="Phone Number" value={targetUser.phoneNumber} />
                      <ProfileField label="Address" value={targetUser.address} />
                    </div>

                    {/* Social Media Section */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h3 className="text-xl font-bold text-white mb-6">Social Media</h3>
                      <div className="flex gap-4 flex-wrap">
                        {targetUser.linkedin && (
                          <SocialLink href={targetUser.linkedin} target="_blank" icon="linkedin" />
                        )}
                        {targetUser.instagram && (
                          <SocialLink href={targetUser.instagram} target="_blank" icon="instagram" />
                        )}
                        {targetUser.facebook && (
                          <SocialLink href={targetUser.facebook} target="_blank" icon="facebook" />
                        )}
                        {targetUser.github && (
                          <SocialLink href={targetUser.github} target="_blank" icon="github" />
                        )}
                        {targetUser.twitter && (
                          <SocialLink href={targetUser.twitter} target="_blank" icon="twitter" />
                        )}
                        {targetUser.website && (
                          <SocialLink href={targetUser.website} target="_blank" icon="website" />
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
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

// Helper component for profile fields
function ProfileField({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-white">{value || "Not specified"}</dd>
    </div>
  );
}

// Helper component for social media links
function SocialLink({ href, icon }) {
  const iconClass = "w-8 h-8 text-gray-400 hover:text-white transition-colors";

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={iconClass}>
      {icon === "instagram" && <InstagramIcon />}
      {icon === "linkedin" && <LinkedInIcon />}
      {icon === "facebook" && <FacebookIcon />}
      {icon === "github" && <GitHubIcon />}
      {icon === "website" && <WebsiteIcon />}
      {icon === "twitter" && <TwitterIcon />}
    </a>
  );
}