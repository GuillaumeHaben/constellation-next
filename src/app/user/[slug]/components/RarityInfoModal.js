"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@heroui/react";

export default function RarityInfoModal({ isOpen, onClose }) {
    const rarityLevels = [
        {
            name: "Legendary",
            description: "Owned by less than 5% of users",
            color: "text-warning",
            bg: "bg-warning/10",
            border: "border-warning/20",
            threshold: "< 5%"
        },
        {
            name: "Epic",
            description: "Owned by 5% to 20% of users",
            color: "text-secondary",
            bg: "bg-secondary/10",
            border: "border-secondary/20",
            threshold: "< 20%"
        },
        {
            name: "Rare",
            description: "Owned by 20% to 50% of users",
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
            threshold: "< 50%"
        },
        {
            name: "Common",
            description: "Owned by more than 50% of users",
            color: "text-default-500",
            bg: "bg-default-100/50",
            border: "border-default-200",
            threshold: "> 50%"
        }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col">Understanding Rarity</ModalHeader>
                <ModalBody>
                    <p className="text-sm text-gray-400 mb-2">
                        Pin rarity is dynamic and calculated based on system-wide ownership.
                        As more users collect a pin, its rarity decreases.
                    </p>
                    <div className="flex flex-col gap-2">
                        {rarityLevels.map((lvl) => (
                            <div
                                key={lvl.name}
                                className={`p-4 rounded-xl border ${lvl.border} ${lvl.bg} flex items-center justify-between transition-all hover:scale-[1.02]`}
                            >
                                <div>
                                    <h3 className={`font-bold ${lvl.color}`}>{lvl.name}</h3>
                                    <p className="text-xs text-gray-300">{lvl.description}</p>
                                </div>
                                <div className={`text-sm font-mono font-bold ${lvl.color} opacity-80`}>
                                    {lvl.threshold}
                                </div>
                            </div>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="flat" onPress={onClose}>
                        Got it
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
