"use client";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/service/userService";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import { use, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { PencilIcon } from "@heroicons/react/24/solid";

// Constants for dropdown options
const ESA_SITES = ["ESTEC", "HQ", "ESOC", "ESAC", "ESRIN", "EAC", "Space Port", "ESEC", "ECSAT"];
const DIRECTORATES = ["TEC", "NAV", "RES", "CIC", "SCI", "STS", "SLE", "HRE", "EOP", "OPS", "CSC"];
const COUNTRIES = [
  "Austria", "Belgium", "Czech Republic", "Denmark", "Estonia", "Finland", "France",
  "Germany", "Greece", "Hungary", "Ireland", "Italy", "Luxembourg", "Netherlands",
  "Norway", "Poland", "Portugal", "Romania", "Slovenia", "Spain", "Sweden",
  "Switzerland", "United Kingdom"
];
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

const POSITIONS = ["Intern", "YGT", "IRF", "JP", "Staff", "Contractor", "Visiting researcher"];

export default function User({ params }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

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
      twitter: targetUser.twitter || null,
      directorate: targetUser.directorate || null,
      position: targetUser.position || null,
      // workDomain: targetUser.workDomain || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await userService.update(targetUser.id, editForm, token);
      setTargetUser({ ...targetUser, ...editForm });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-full">
      <NavBar />
      <header className="relative bg-[#003247] after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
          <BreadCrumbs currentPage={"user/" + slug} targetUser={targetUser}></BreadCrumbs>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {targetUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <Card className="bg-white/5 border border-white/10">
                  <CardBody className="flex flex-col items-center gap-4 p-6">
                    <Avatar
                      src={targetUser.profilePicture}
                      className="w-32 h-32"
                      isBordered
                      color="primary"
                    />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white">
                        {targetUser.firstName} {targetUser.lastName}
                      </h2>
                      <p className="text-gray-400 mt-1">{targetUser.position || "ESA Member"}</p>
                      <p className="text-gray-400 text-sm">{targetUser.esaSite || "ESA"}</p>
                    </div>
                    {isOwnProfile && (
                      <Button
                        color="primary"
                        startContent={<PencilIcon className="w-4 h-4" />}
                        onPress={handleEditClick}
                        className="w-full mt-2"
                      >
                        Edit Profile
                      </Button>
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
                      <ProfileField label="Country" value={COUNTRY_EMOJIS[targetUser.country] + " " + targetUser.country} />
                      <ProfileField label="ESA Site" value={targetUser.esaSite} />
                      <ProfileField label="Directorate" value={targetUser.directorate} />
                      <ProfileField label="Position" value={targetUser.position} />
                      <ProfileField label="Work Domain" value={targetUser.workDomain} />
                      <ProfileField label="Phone Number" value={targetUser.phoneNumber} />
                      <ProfileField label="Address" value={targetUser.address} />
                    </div>

                    {/* Social Media Section */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Social Media</h4>
                      <div className="flex gap-4 flex-wrap">
                        {targetUser.instagram && (
                          <SocialLink href={targetUser.instagram} icon="instagram" />
                        )}
                        {targetUser.linkedin && (
                          <SocialLink href={targetUser.linkedin} icon="linkedin" />
                        )}
                        {targetUser.facebook && (
                          <SocialLink href={targetUser.facebook} icon="facebook" />
                        )}
                        {targetUser.github && (
                          <SocialLink href={targetUser.github} icon="github" />
                        )}
                        {targetUser.twitter && (
                          <SocialLink href={targetUser.twitter} icon="twitter" />
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

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              />
              <Input
                label="Birthday"
                type="date"
                value={editForm.birthday}
                onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
              />
              <Select
                label="Country"
                selectedKeys={editForm.country ? [editForm.country] : []}
                onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
              >
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="ESA Site"
                selectedKeys={editForm.esaSite ? [editForm.esaSite] : []}
                onChange={(e) => setEditForm({ ...editForm, esaSite: e.target.value })}
              >
                {ESA_SITES.map((site) => (
                  <SelectItem key={site} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Directorate"
                selectedKeys={editForm.directorate ? [editForm.directorate] : []}
                onChange={(e) => setEditForm({ ...editForm, directorate: e.target.value })}
              >
                {DIRECTORATES.map((dir) => (
                  <SelectItem key={dir} value={dir}>
                    {dir}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Position at ESA"
                selectedKeys={editForm.position ? [editForm.position] : []}
                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
              >
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Work Domain"
                value={editForm.workDomain}
                onChange={(e) => setEditForm({ ...editForm, workDomain: e.target.value })}
              />
              <Input
                label="Address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="md:col-span-2"
              />
              <Input
                label="Phone Number"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
              />
              <Input
                label="Instagram"
                placeholder="https://instagram.com/username"
                value={editForm.instagram}
                onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
              />
              <Input
                label="LinkedIn"
                placeholder="https://linkedin.com/in/username"
                value={editForm.linkedin}
                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
              />
              <Input
                label="Facebook"
                placeholder="https://facebook.com/username"
                value={editForm.facebook}
                onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
              />
              <Input
                label="GitHub"
                placeholder="https://github.com/username"
                value={editForm.github}
                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
              />
              <Input
                label="X (Twitter)"
                placeholder="https://x.com/username"
                value={editForm.twitter}
                onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveProfile}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
      {icon === "twitter" && <TwitterIcon />}
    </a>
  );
}

// Social Media SVG Icons
function InstagramIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}