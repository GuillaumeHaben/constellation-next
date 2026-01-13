"use client";

import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input
} from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function LanguageLibraryModal({ isOpen, onClose, onLanguageAdded, spokenLanguages = {}, currentLanguages = [] }) {
    const [search, setSearch] = useState("");

    const handleAdd = (langName) => {
        if (onLanguageAdded) onLanguageAdded(langName);
    };

    const filteredLanguages = Object.entries(spokenLanguages).filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Language Library
                    <Input
                        placeholder="Search languages..."
                        startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                        value={search}
                        onValueChange={setSearch}
                        className="mt-2"
                        size="sm"
                    />
                </ModalHeader>
                <ModalBody>
                    {filteredLanguages.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No languages found.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredLanguages.map(([name, emoji]) => {
                                const isOwned = currentLanguages.includes(name);
                                return (
                                    <div key={name} className="border border-gray-800 rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-gray-800/50 transition relative group">
                                        <div className="w-16 h-16 flex items-center justify-center text-4xl border border-white/10 rounded-full bg-white/5">
                                            {emoji}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-sm truncate w-full">{name}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            color={isOwned ? "default" : "success"}
                                            variant={isOwned ? "flat" : "solid"}
                                            className="w-full mt-auto"
                                            isDisabled={isOwned}
                                            onPress={() => handleAdd(name)}
                                        >
                                            {isOwned ? "Added" : "Add"}
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
