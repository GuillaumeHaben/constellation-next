"use client";

import { Card, CardBody } from "@heroui/react";
import {
    CalendarIcon,
    GlobeAltIcon,
    MapPinIcon,
    BuildingOffice2Icon,
    BriefcaseIcon,
    PhoneIcon,
    HomeIcon
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

export default function TabOverview({ targetUser }) {

    const overviewTiles = [
        {
            key: "country",
            label: "Country",
            value: targetUser.country ? `${COUNTRY_EMOJIS[targetUser.country] ?? ""} ${targetUser.country}`.trim() : null,
            icon: GlobeAltIcon
        },
        {
            key: "site",
            label: "ESA Site",
            value: targetUser.esaSite,
            icon: MapPinIcon
        },
        {
            key: "directorate",
            label: "Directorate",
            value: targetUser.directorate,
            icon: BuildingOffice2Icon
        },
        {
            key: "position",
            label: "Position",
            value: targetUser.position,
            icon: BriefcaseIcon
        },
        {
            key: "phone",
            label: "Phone Number",
            value: targetUser.phoneNumber,
            icon: PhoneIcon
        },
        {
            key: "address",
            label: "Address",
            value: targetUser.address,
            icon: HomeIcon
        }
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {overviewTiles.map((tile) => (
                    <Card key={tile.key} className="bg-slate-800/40 border-slate-700/50 rounded-2xl">
                        <CardBody className="p-6 flex flex-col items-center text-center gap-3">
                            {tile.icon && <tile.icon className="w-8 h-8 text-slate-500" />}
                            <div className="space-y-1">
                                <p className="text-white font-semibold">{tile.label}</p>
                                <p className="text-slate-400 text-sm break-words">
                                    {tile.value || "Not specified"}
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </>
    );
}
