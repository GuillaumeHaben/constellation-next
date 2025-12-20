"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, Button, Tooltip, Badge } from "@heroui/react";
import { PlusIcon, QuestionMarkCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
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
        // Confirmation removed as requested
        // if (!confirm("Are you sure you want to remove this pin?")) return;
        try {
            const token = localStorage.getItem("token");
            await pinService.unequipPin(instanceId, targetUser.id, token);
            setPins(prev => prev.filter(p => (p.documentId || p.id) !== instanceId));
        } catch (error) {
            console.error("Failed to remove pin", error);
            // Alert removed as requested
        }
    };

    // Extract owned pin IDs for the library check
    const ownedPinIds = pins.map(p => p.documentId || p.id).filter(Boolean);

    return (
        <div className="py-2">
            <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:max-w-4xl">
                {/* Header Actions - Stacked on Mobile, Row on Desktop */}
                <div
                    className="flex items-center justify-center px-4 py-2 rounded-xl border-1 border-white/60 text-white font-semibold text-sm bg-white/10 sm:flex-none"
                >
                    {ownedPinIds.length} pins owned
                </div>

                {(isOwnProfile && isCrew) && (
                    <>
                        {/* Suggest Pin Button (Crew/Manager/Admin) */}
                        <Button
                            color="warning"
                            variant="flat"
                            onPress={() => setShowSuggestion(true)}
                            className="w-full sm:w-auto sm:flex-1 font-semibold"
                        >
                            <QuestionMarkCircleIcon className="w-5 h-5 text-warning" />
                            Suggest Pin
                        </Button>
                        {/* Add Pin Button (Owner) */}
                        <Button
                            color="success"
                            variant="flat"
                            onPress={() => setShowLibrary(true)}
                            className="w-full sm:w-auto sm:flex-1 font-semibold"
                        >
                            <PlusIcon className="w-5 h-5 text-success" />
                            Add Pin
                        </Button>
                    </>
                )}
                <Button
                    color="primary"
                    variant="flat"
                    onPress={() => setShowRarityInfo(true)}
                    className="w-full sm:w-auto sm:flex-1 font-semibold"
                >
                    <InformationCircleIcon className="w-5 h-5 text-primary" />
                    How it works
                </Button>
            </div>

            {/* Pins Grid - Left aligned for better scalability */}
            {loading ? (
                <div className="text-center text-gray-500 py-4">Loading pins...</div>
            ) : pins.length === 0 ? (
                <div className="text-center text-gray-500 py-8 border-2 border-dashed border-slate-700/50 rounded-2xl">
                    No pins collected yet. Open the library to add your first pin!
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-start items-start">
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
                                                className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover/pin:opacity-100 transition-all duration-200 z-20 shadow-xl scale-90 group-hover/pin:scale-100"
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
