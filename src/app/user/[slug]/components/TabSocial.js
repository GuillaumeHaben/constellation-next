"use client";

import { InstagramIcon, LinkedInIcon, FacebookIcon, GitHubIcon, TwitterIcon, WebsiteIcon } from "@/components/Icons";

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

export default function TabSocial({ targetUser }) {
    return (
        <>
            <div className="flex justify-center gap-8 items-center">
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
        </>
    );
}
