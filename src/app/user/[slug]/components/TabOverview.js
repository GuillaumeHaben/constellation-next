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
    PencilSquareIcon,
    GlobeEuropeAfricaIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { userService } from "@/service/userService";
import LanguageLibraryModal from "./LanguageLibraryModal";
import TwemojiFlag from "@/components/TwemojiFlag";

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

const SPOKEN_LANGUAGES = {
    "English": "🇬🇧",
    "Spanish": "🇪🇸",
    "Portuguese": "🇵🇹",
    "French": "🇫🇷",
    "German": "🇩🇪",
    "Italian": "🇮🇹",
    "Polish": "🇵🇱",
    "Japanese": "🇯🇵",
    "Chinese": "🇨🇳",
    "Hindi": "🇮🇳",
    "Arabic": "🇦🇪",
    "Russian": "🇷🇺",
    "Turkish": "🇹🇷",
    "Korean": "🇰🇷",
    "Ukrainian": "🇺🇦",
    "Dutch": "🇳🇱",
    "Romanian": "🇷🇴",
    "Czech": "🇨🇿",
    "Hungarian": "🇭🇺",
    "Greek": "🇬🇷",
    "Swedish": "🇸🇪",
    "Bulgarian": "🇧🇬",
    "Serbian": "🇷🇸",
    "Croatian": "🇭🇷",
    "Slovak": "🇸🇰",
    "Danish": "🇩🇰",
    "Finnish": "🇫🇮",
    "Norwegian": "🇳🇴",
    "Lithuanian": "🇱🇹",
    "Albanian": "🇦🇱",
    "Belarusian": "🇧🇾",
    "Slovenian": "🇸🇮",
    "Latvian": "🇱🇻",
    "Macedonian": "🇲🇰",
    "Estonian": "🇪🇪",
    "Bosnian": "🇧🇦",
    "Welsh": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "Irish": "🇮🇪",
    "Icelandic": "🇮🇸",
    "Maltese": "🇲🇹",
    "Luxembourgish": "🇱🇺",
    "Montenegrin": "🇲🇪"
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


export default function TabOverview({ targetUser, onUpdateUser }) {
    const { user: currentUser } = useAuth();
    const [spokenLanguages, setSpokenLanguages] = useState(targetUser.spoken_languages || []);
    const [showLibrary, setShowLibrary] = useState(false);

    // Sync local state when prop updates (fixing race condition)
    useEffect(() => {
        if (targetUser?.spoken_languages) {
            setSpokenLanguages(targetUser.spoken_languages);
        }
    }, [targetUser?.spoken_languages]);

    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const isOwnProfile = currentUser && targetUser && currentUser.slug === targetUser.slug;

    const handleAddLanguage = async (langName) => {
        if (spokenLanguages.includes(langName)) return;

        const newLanguages = [...spokenLanguages, langName];
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            await userService.update(currentUser.id, { spoken_languages: newLanguages }, token);
            setSpokenLanguages(newLanguages);
            // Update parent state immediately
            if (onUpdateUser) {
                onUpdateUser({ ...targetUser, spoken_languages: newLanguages });
            }
        } catch (error) {
            console.error("Failed to add language", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLanguage = async (langName) => {
        const newLanguages = spokenLanguages.filter(l => l !== langName);
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            await userService.update(currentUser.id, { spoken_languages: newLanguages }, token);
            setSpokenLanguages(newLanguages);
            // Update parent state immediately
            if (onUpdateUser) {
                onUpdateUser({ ...targetUser, spoken_languages: newLanguages });
            }
        } catch (error) {
            console.error("Failed to delete language", error);
        } finally {
            setIsSaving(false);
        }
    };

    const overviewTiles = [
        {
            key: "country",
            label: "Country",
            value: targetUser.country ? (
                <div className="flex items-center gap-2">
                    {COUNTRY_EMOJIS[targetUser.country] && (
                        <TwemojiFlag emoji={COUNTRY_EMOJIS[targetUser.country]} />
                    )}
                    <span>{targetUser.country}</span>
                </div>
            ) : null,
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
        <>
            <div className="grid grid-cols-1 pt-3 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {visibleTiles.map((tile) => (
                    <Card
                        key={tile.key}
                        className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 shadow-lg backdrop-blur-sm"
                    >
                        <CardBody className="p-5 relative overflow-hidden group">
                            {/* Decorative background icon */}
                            <tile.icon className="absolute -right-3 -bottom-3 w-20 h-20 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-500" />

                            <div className="flex flex-col gap-3">
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
            <div className="mt-6">
                <div className="flex items-center sm:justify-between justify-center flex-wrap gap-3 mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Spoken Languages</h3>
                    {isOwnProfile && (
                        <>
                            <Button
                                color="success"
                                variant="flat"
                                onPress={() => setShowLibrary(true)}
                                className="font-bold"
                                startContent={<PlusIcon className="w-4 h-4" />}
                            >
                                Add Language
                            </Button>
                            <div className="flex flex-row sm:hidden">
                                <Button
                                    color={isEditing ? "danger" : "primary"}
                                    variant="flat"
                                    onPress={() => setIsEditing(!isEditing)}
                                    className="font-bold"
                                    startContent={<PencilSquareIcon className="w-4 h-4" />}
                                >
                                    {isEditing ? "Done" : "Edit"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {spokenLanguages.length === 0 ? (
                    <div className="text-center text-slate-500 border border-dashed border-slate-700/50 rounded-2xl py-8">
                        No spoken languages recorded yet. {isOwnProfile && "Add your first language!"}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                        {spokenLanguages.map((langName) => {
                            const emoji = SPOKEN_LANGUAGES[langName] || "🌐";
                            return (
                                <div key={langName} className="flex flex-col items-center group/item transition-transform duration-200">
                                    <div className="relative group/lang w-16 h-16 sm:w-20 sm:h-20">
                                        <Tooltip content={langName} placement="top" closeDelay={0}>
                                            <div className="w-full h-full flex items-center justify-center border border-white/10 rounded-full bg-white/5 cursor-default group-hover/lang:bg-white/10 transition-colors">
                                                <TwemojiFlag emoji={emoji} size={36} />
                                            </div>
                                        </Tooltip>

                                        {isOwnProfile && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteLanguage(langName);
                                                }}
                                                className={`absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-all duration-200 z-20 shadow-xl scale-90 ${isEditing ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/lang:opacity-100 group-hover/lang:scale-100 group-hover/lang:pointer-events-auto'}`}
                                                title="Remove Language"
                                                disabled={isSaving}
                                            >
                                                <XMarkIcon className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] text-gray-400 mt-2 uppercase tracking-tight font-semibold opacity-70 group-hover/item:opacity-100 transition-opacity">
                                        {langName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <LanguageLibraryModal
                isOpen={showLibrary}
                onClose={() => setShowLibrary(false)}
                onLanguageAdded={handleAddLanguage}
                spokenLanguages={SPOKEN_LANGUAGES}
                currentLanguages={spokenLanguages}
            />
        </>
    );
}

