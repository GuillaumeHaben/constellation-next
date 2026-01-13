"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Avatar, Button, Tooltip, Chip, Card, CardBody } from "@heroui/react";
import { PlusIcon, LightBulbIcon, InformationCircleIcon, SparklesIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { pinService } from "@/service/pinService";
import { useAuth } from "@/context/AuthContext";
import PinLibraryModal from "./PinLibraryModal";
import PinSuggestionModal from "./PinSuggestionModal";
import RarityInfoModal from "./RarityInfoModal";

export default function TabPins({ targetUser }) {
    const { user } = useAuth(); // Current logged in user
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showLibrary, setShowLibrary] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [showRarityInfo, setShowRarityInfo] = useState(false);

    // Edit mode state for mobile deletion
    const [isEditing, setIsEditing] = useState(false);

    const isOwnProfile = user && targetUser && user.slug === targetUser.slug;
    const isCrew = user && (user.role?.name === "Crew" || user.role?.name === "Manager" || user.role?.name === "Admin");

    const fetchPins = useCallback(async () => {
        if (!targetUser?.id) return;
        try {
            const token = localStorage.getItem("token");
            const userPins = await pinService.getUserPins(targetUser.id, token);
            setPins(userPins || []);
        } catch (error) {
            console.error("Failed to fetch pins", error);
        } finally {
            setLoading(false);
        }
    }, [targetUser]);

    // Fetch pins on mount
    useEffect(() => {
        fetchPins();
    }, [fetchPins]);

    // Handle unequip
    const handleUnequip = async (instanceId) => {
        try {
            const token = localStorage.getItem("token");
            await pinService.unequipPin(instanceId, targetUser.id, token);
            setPins(prev => prev.filter(p => (p.documentId || p.id) !== instanceId));
        } catch (error) {
            console.error("Failed to remove pin", error);
        }
    };

    // Extract owned pin IDs for the library check
    const ownedPinIds = pins.map(p => p.documentId || p.id).filter(Boolean);

    // Calculate rarity breakdown
    const rarityBreakdown = useMemo(() => {
        const counts = { legendary: 0, epic: 0, rare: 0, common: 0 };
        pins.forEach(pin => {
            const info = getRarityInfo(pin.rarity);
            if (info.label === 'Legendary') counts.legendary++;
            else if (info.label === 'Epic') counts.epic++;
            else if (info.label === 'Rare') counts.rare++;
            else counts.common++;
        });
        return counts;
    }, [pins]);

    return (
        <div className="flex flex-col gap-2 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Stats Summary Card - Matching TabIRL style */}
            <Card className="mb-6 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/30 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
                <CardBody className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-purple-600 rounded-2xl shadow-xl shadow-purple-600/40">
                                <SparklesIcon className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-purple-200/70 text-sm font-bold uppercase tracking-widest">Pin Collection</h3>
                                <p className="text-5xl font-black text-white mt-1">{pins.length}</p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-purple-100/60 text-sm mb-2 font-medium">Rarity Info</p>
                            <Tooltip content="Learn about pin rarity" placement="left">
                                <button
                                    onClick={() => setShowRarityInfo(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 font-bold hover:bg-purple-500/30 transition-colors"
                                >
                                    <InformationCircleIcon className="w-5 h-5" />
                                    How it works
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Rarity Breakdown */}
            <div className="flex flex-wrap gap-2 mb-6">
                {rarityBreakdown.legendary > 0 && (
                    <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                            base: "bg-warning/15 border border-warning/30",
                            content: "text-warning font-semibold text-xs"
                        }}
                    >
                        ✦ {rarityBreakdown.legendary} Legendary
                    </Chip>
                )}
                {rarityBreakdown.epic > 0 && (
                    <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                            base: "bg-secondary/15 border border-secondary/30",
                            content: "text-secondary font-semibold text-xs"
                        }}
                    >
                        ◆ {rarityBreakdown.epic} Epic
                    </Chip>
                )}
                {rarityBreakdown.rare > 0 && (
                    <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                            base: "bg-primary/15 border border-primary/30",
                            content: "text-primary font-semibold text-xs"
                        }}
                    >
                        ● {rarityBreakdown.rare} Rare
                    </Chip>
                )}
                {rarityBreakdown.common > 0 && (
                    <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                            base: "bg-default/15 border border-default/30",
                            content: "text-default-500 font-semibold text-xs"
                        }}
                    >
                        ○ {rarityBreakdown.common} Common
                    </Chip>
                )}
            </div>

            {/* Action Buttons - Only for own profile */}
            {/* Action Buttons - Only for own profile */}
            {isOwnProfile && (
                <>
                    <div className="flex flex-row gap-6 mb-6">
                        {isCrew && (
                            <>
                                <Button
                                    color="success"
                                    variant="flat"
                                    onPress={() => setShowLibrary(true)}
                                    className="flex-1 font-semibold h-12"
                                    startContent={<PlusIcon className="w-5 h-5" />}
                                >
                                    Add Pin
                                </Button>
                                <Button
                                    color="warning"
                                    variant="flat"
                                    onPress={() => setShowSuggestion(true)}
                                    className="flex-1 font-semibold h-12"
                                    startContent={<LightBulbIcon className="w-5 h-5" />}
                                >
                                    Suggest Pin
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="flex flex-row gap-3 mb-6 sm:hidden">
                        <Button
                            color={isEditing ? "danger" : "primary"}
                            variant="flat"
                            onPress={() => setIsEditing(!isEditing)}
                            className="font-semibold h-12 flex-1"
                            startContent={<PencilSquareIcon className="w-5 h-5" />}
                        >
                            {isEditing ? "Done" : "Edit"}
                        </Button>
                    </div>
                </>
            )}

            {/* Pins Grid - Left aligned for better scalability */}
            {loading ? (
                <div className="text-center text-gray-500 py-4">Loading pins...</div>
            ) : pins.length === 0 ? (
                isOwnProfile ? (
                    <div className="text-center text-gray-500 py-8 border-2 border-dashed border-slate-700/50 rounded-2xl">
                        No pins collected yet. Open the library to add your first pin!
                    </div>
                ) : null
            ) : (
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center items-center sm:justify-start sm:items-start">
                    {[...pins]
                        .sort((a, b) => (parseFloat(b.rarity) || 0) - (parseFloat(a.rarity) || 0))
                        .map((pin) => {
                            if (!pin) return null;

                            // Image URL handling - standard Strapi behavior
                            const imageUrl = pin.image?.url
                                ? (pin.image.url.startsWith("http") ? pin.image.url : `${process.env.NEXT_PUBLIC_API_URL}${pin.image.url}`)
                                : null;

                            return (
                                <div key={pin.id} className="flex flex-col items-center group/item transition-transform duration-200">
                                    <div className="relative group/pin w-16 h-16 sm:w-20 sm:h-20">
                                        <Tooltip content={pin.name} placement="top" closeDelay={0}>
                                            <Avatar
                                                className="w-full h-full cursor-default"
                                                isBordered
                                                color={getRarityInfo(pin.rarity).color}
                                                src={imageUrl}
                                                name={pin.name?.charAt(0)}
                                            />
                                        </Tooltip>

                                        {isOwnProfile && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnequip(pin.documentId || pin.id);
                                                }}
                                                className={`absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-all duration-200 z-20 shadow-xl scale-90 ${isEditing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:pointer-events-auto'}`}
                                                title="Remove Pin"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] text-gray-400 mt-2 uppercase tracking-tight font-semibold opacity-70 group-hover/item:opacity-100 transition-opacity">
                                        {getRarityInfo(pin.rarity).label}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            )}

            <PinLibraryModal
                isOpen={showLibrary}
                onClose={() => setShowLibrary(false)}
                targetUser={targetUser}
                onPinAdded={fetchPins}
                ownedPinIds={ownedPinIds}
            />
            <PinSuggestionModal
                isOpen={showSuggestion}
                onClose={() => setShowSuggestion(false)}
            />
            <RarityInfoModal
                isOpen={showRarityInfo}
                onClose={() => setShowRarityInfo(false)}
            />
        </div>
    );
}

const getRarityInfo = (rarity) => {
    // Rarity is a decimal from 0 to 1 (1 - ownership_percentage)
    const val = parseFloat(rarity) || 0;
    if (val >= 0.95) return { label: 'Legendary', color: 'warning' };
    if (val >= 0.8) return { label: 'Epic', color: 'secondary' };
    if (val >= 0.5) return { label: 'Rare', color: 'primary' };
    return { label: 'Common', color: 'default' };
};
