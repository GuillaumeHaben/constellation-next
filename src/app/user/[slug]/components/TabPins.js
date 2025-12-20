"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, Button, Tooltip } from "@heroui/react";
import { PlusIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { pinService } from "@/service/pinService";
import { useAuth } from "@/context/AuthContext";
import PinLibraryModal from "./PinLibraryModal";
import PinSuggestionModal from "./PinSuggestionModal";

export default function TabPins({ targetUser }) {
    const { user } = useAuth(); // Current logged in user
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showLibrary, setShowLibrary] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);

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
            // Use documentId if available, fallback to id
            await pinService.unequipPin(instanceId, token);
            setPins(prev => prev.filter(p => (p.documentId || p.id) !== instanceId));
        } catch (error) {
            console.error("Failed to remove pin", error);
            // Alert removed as requested
        }
    };

    // Extract owned pin IDs (of the Pin definition, not the instance) for the library check
    const ownedPinIds = pins.map(p => p.pin?.documentId || p.pin?.id).filter(Boolean);

    return (
        <div className="py-2">
            {/* Header Actions - Mimicking Sidebar Style */}
            {(isOwnProfile && isCrew) && (
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    {/* Suggest Pin Button (Crew/Manager/Admin) */}
                    <Button
                        color="warning"
                        variant="flat"
                        onPress={() => setShowSuggestion(true)}
                        className="flex-1 font-semibold"
                    >
                        <QuestionMarkCircleIcon className="w-4 h-4" />
                        Suggest Pin
                    </Button>
                    {/* Add Pin Button (Owner) */}
                    <Button
                        color="success"
                        variant="flat"
                        onPress={() => setShowLibrary(true)}
                        className="flex-1 font-semibold"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Pin
                    </Button>
                </div>
            )}

            {/* Pins Grid - Left aligned for better scalability */}
            {loading ? (
                <div className="text-center text-gray-500 py-4">Loading pins...</div>
            ) : pins.length === 0 ? (
                <div className="text-center text-gray-500 py-8 border-2 border-dashed border-slate-700/50 rounded-2xl">
                    No pins collected yet. Open the library to add your first pin!
                </div>
            ) : (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Owned: {ownedPinIds.length}</h2>
                    <br />

                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-start items-start">
                        {pins.map((instance) => {
                            const pin = instance.pin;
                            if (!pin) return null;

                            // Image URL handling - standard Strapi behavior
                            const imageUrl = pin.image?.url
                                ? (pin.image.url.startsWith("http") ? pin.image.url : `${process.env.NEXT_PUBLIC_API_URL}${pin.image.url}`)
                                : null;

                            return (
                                <div key={instance.id} className="flex flex-col items-center group/item transition-transform duration-200">
                                    {/* Trigger area limited strictly to the pin container using a named group */}
                                    <div className="relative group/pin w-16 h-16 sm:w-20 sm:h-20">
                                        <Tooltip content={pin.name} placement="top" closeDelay={0}>
                                            <Avatar
                                                className="w-full h-full cursor-default"
                                                isBordered
                                                color={getRarityColor(pin.rarity)}
                                                src={imageUrl}
                                                name={pin.name?.charAt(0)}
                                            />
                                        </Tooltip>

                                        {isOwnProfile && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnequip(instance.documentId || instance.id);
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
                                        {pin.rarity}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
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
        </div>
    );
}

function getRarityColor(rarity) {
    switch (rarity) {
        case 'legendary': return 'warning'; // Gold-ish
        case 'epic': return 'secondary'; // Purple
        case 'rare': return 'primary'; // Blue
        default: return 'default'; // Common/Gray
    }
}
