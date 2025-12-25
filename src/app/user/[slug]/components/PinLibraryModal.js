"use client";

import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Avatar,
    Input
} from "@heroui/react";
import { pinService } from "@/service/pinService";
import { useAuth } from "@/context/AuthContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const getRarityInfo = (rarity) => {
    const val = parseFloat(rarity) || 0;
    if (val >= 0.95) return { label: 'Legendary', color: 'warning' };
    if (val >= 0.8) return { label: 'Epic', color: 'secondary' };
    if (val >= 0.5) return { label: 'Rare', color: 'primary' };
    return { label: 'Common', color: 'default' };
};

export default function PinLibraryModal({ isOpen, onClose, targetUser, onPinAdded, ownedPinIds = [] }) {
    const { user } = useAuth();
    const [pins, setPins] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [equipping, setEquipping] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchLibrary();
        }
    }, [isOpen]);

    const fetchLibrary = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const allPins = await pinService.getAllApproved(token);
            setPins(allPins || []);
        } catch (error) {
            console.error("Failed to fetch library", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEquip = async (pinId) => {
        setEquipping(pinId);
        try {
            const token = localStorage.getItem("token");
            await pinService.equipPin(pinId, targetUser.id, token);
            if (onPinAdded) onPinAdded(); // Callback to refresh the parent list
            // Optionally close or show success
            // onClose(); 
        } catch (error) {
            console.error("Failed to add pin", error);
            alert("Failed to add pin");
        } finally {
            setEquipping(null);
        }
    };

    const filteredPins = pins.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Pin Library
                    <Input
                        placeholder="Search pins..."
                        startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                        value={search}
                        onValueChange={setSearch}
                        className="mt-2"
                        size="sm"
                    />
                </ModalHeader>
                <ModalBody>
                    {loading ? (
                        <div className="text-center py-8">Loading library...</div>
                    ) : filteredPins.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No pins found.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredPins.map((pin) => {
                                const isOwned = ownedPinIds.includes(pin.documentId || pin.id);
                                return (
                                    <div key={pin.id} className="border border-gray-800 rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-gray-800/50 transition relative group">
                                        <Avatar
                                            src={pin.image?.url
                                                ? (pin.image.url.startsWith("http") ? pin.image.url : `${process.env.NEXT_PUBLIC_API_URL}${pin.image.url}`)
                                                : null}
                                            className="w-16 h-16"
                                            isBordered
                                            color={getRarityInfo(pin.rarity).color}
                                        />
                                        <div className="text-center">
                                            <p className="font-semibold text-sm truncate w-full">{pin.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{getRarityInfo(pin.rarity).label}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            color={isOwned ? "default" : "primary"}
                                            variant={isOwned ? "flat" : "solid"}
                                            className="w-full mt-auto"
                                            isLoading={equipping === pin.id}
                                            isDisabled={isOwned}
                                            onPress={() => handleEquip(pin.documentId || pin.id)}
                                        >
                                            {isOwned ? "Owned" : "Add"}
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
