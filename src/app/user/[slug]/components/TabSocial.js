"use client";

import { Card, CardBody, Tooltip } from "@heroui/react";
import { GlobeAmericasIcon } from "@heroicons/react/24/outline";

// Inline SVG icons with proper sizing (the imported ones have fixed sizes)
const SocialIcons = {
    linkedin: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    instagram: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
    twitter: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    facebook: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    github: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    ),
    website: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
        </svg>
    )
};

// Privacy indicator component (all social links are public)
function PrivacyBadge() {
    return (
        <Tooltip
            content="Visible to all members"
            placement="top"
        >
            <div className="p-1 rounded-full bg-emerald-500/20">
                <GlobeAmericasIcon className="w-5 h-5 text-emerald-400" />
            </div>
        </Tooltip>
    );
}

export default function TabSocial({ targetUser }) {
    const socialLinks = [
        { key: "linkedin", label: "LinkedIn", value: targetUser.linkedin, icon: SocialIcons.linkedin, action: "Connect", color: "#0e76a8" },
        { key: "instagram", label: "Instagram", value: targetUser.instagram, icon: SocialIcons.instagram, action: "Follow", color: "#e1306c" },
        { key: "twitter", label: "Twitter / X", value: targetUser.twitter, icon: SocialIcons.twitter, action: "Follow", color: "#1DA1F2" },
        { key: "facebook", label: "Facebook", value: targetUser.facebook, icon: SocialIcons.facebook, action: "Connect", color: "#1877F2" },
        { key: "github", label: "GitHub", value: targetUser.github, icon: SocialIcons.github, action: "View", color: "#ffffffff" },
        { key: "website", label: "Website", value: targetUser.website, icon: SocialIcons.website, action: "Visit", color: "#ffffffff" }
    ];

    const activeSocialLinks = socialLinks.filter(link => link.value);

    if (activeSocialLinks.length === 0) {
        return (
            <div className="flex flex-col gap-2 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center text-gray-500 py-8 border-2 border-dashed border-slate-700/50 rounded-2xl">
                    No social links available. Edit your profile to add some.
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 pt-3 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeSocialLinks.map((link) => (
                <a
                    key={link.key}
                    href={link.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <Card className="bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer">
                        <CardBody className="p-5">
                            <div className="flex flex-col gap-3">
                                {/* Header with icon, label, and privacy badge */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300" style={{ color: link.color }}>
                                            {link.icon}
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {link.label}
                                        </span>
                                    </div>
                                    <PrivacyBadge />
                                </div>

                                {/* Action text */}
                                <div className="mt-1">
                                    <span className="text-sm font-medium text-slate-300 hover:text-white">
                                        {link.action} →
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </a>
            ))}
        </div>
    );
}
