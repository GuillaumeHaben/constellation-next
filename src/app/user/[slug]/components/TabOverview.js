"use client";

import {
    Card,
    CardBody
} from "@heroui/react";
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

const getAgeDisplay = (birthdayStr) => {
    if (!birthdayStr) return null;
    const date = new Date(birthdayStr);
    if (isNaN(date)) return null;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const hasHadBirthdayThisYear = (today.getMonth() > date.getMonth()) || (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
    if (!hasHadBirthdayThisYear) age--;
    const isBirthdayToday = today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
    return `${isBirthdayToday ? ' 🎂' : ''} ${age} years old`;
};

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

export default function TabOverview({ targetUser }) {
    return (
        <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow hover:border-slate-600 mt-4">
            <CardBody className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField label="Age" value={getAgeDisplay(targetUser.birthday)} />
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
    );
}
