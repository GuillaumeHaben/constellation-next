"use client";

import { Card, CardBody, Tooltip } from "@heroui/react";
import {
    GlobeAltIcon,
    MapPinIcon,
    BuildingOffice2Icon,
    BriefcaseIcon,
    PhoneIcon,
    HomeIcon,
    LockClosedIcon,
    GlobeEuropeAfricaIcon
} from "@heroicons/react/24/outline";

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

// Privacy indicator component
function PrivacyBadge({ isPrivate }) {
    return (
        <Tooltip
            content={isPrivate ? "Only visible to you" : "Visible to all members"}
            placement="top"
        >
            <div className={`p-1 rounded-full ${isPrivate ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
                {isPrivate ? (
                    <LockClosedIcon className="w-5 h-5 text-amber-400" />
                ) : (
                    <GlobeEuropeAfricaIcon className="w-5 h-5 text-emerald-400" />
                )}
            </div>
        </Tooltip>
    );
}

import { useAuth } from "@/context/AuthContext";

export default function TabOverview({ targetUser }) {
    const { user: currentUser } = useAuth();
    const isOwnProfile = currentUser && targetUser && currentUser.slug === targetUser.slug;

    const overviewTiles = [
        {
            key: "country",
            label: "Country",
            value: targetUser.country ? `${COUNTRY_EMOJIS[targetUser.country] ?? ""} ${targetUser.country}`.trim() : null,
            icon: GlobeAltIcon,
            isPrivate: false
        },
        {
            key: "site",
            label: "ESA Site",
            value: targetUser.esaSite,
            icon: MapPinIcon,
            isPrivate: false
        },
        {
            key: "directorate",
            label: "Directorate",
            value: targetUser.directorate,
            icon: BuildingOffice2Icon,
            isPrivate: false
        },
        {
            key: "position",
            label: "Position",
            value: targetUser.position,
            icon: BriefcaseIcon,
            isPrivate: false
        },
        {
            key: "phone",
            label: "Phone Number",
            value: targetUser.phoneNumber,
            icon: PhoneIcon,
            isPrivate: true
        },
        {
            key: "address",
            label: "Address",
            value: targetUser.address,
            icon: HomeIcon,
            isPrivate: true
        }
    ];

    // Filter out private tiles if not the owner
    const visibleTiles = overviewTiles.filter(tile => {
        if (!isOwnProfile && tile.isPrivate) return false;
        return true;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {visibleTiles.map((tile) => (
                <Card
                    key={tile.key}
                    className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 shadow-lg backdrop-blur-sm"
                >
                    <CardBody className="p-5 relative overflow-hidden group">
                        {/* Decorative background icon */}
                        <tile.icon className="absolute -right-3 -bottom-3 w-20 h-20 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-500" />

                        <div className="flex flex-col gap-2">
                            {/* Header with icon, label, and privacy badge */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                        <tile.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {tile.label}
                                    </span>
                                </div>
                                {isOwnProfile && <PrivacyBadge isPrivate={tile.isPrivate} />}
                            </div>

                            {/* Value */}
                            <div className="mt-1">
                                <span className="text-lg font-semibold text-white tracking-tight">
                                    {tile.value || "Not specified"}
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

