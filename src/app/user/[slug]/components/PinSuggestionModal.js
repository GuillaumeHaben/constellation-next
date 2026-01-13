"use client";

import { useState, useRef } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Image
} from "@heroui/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { pinService } from "@/service/pinService";
import { useAuth } from "@/context/AuthContext";

export default function PinSuggestionModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleNameChange = (val) => {
        setName(val);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!name || !selectedFile) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");

            // 1. Check for duplicates
            const existingPin = await pinService.findByName(name, token);
            if (existingPin) {
                setError("A pin with this name already exists in the library.");
                setLoading(false);
                return;
            }

            // 2. Upload image
            const formData = new FormData();
            formData.append("files", selectedFile);

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const uploadData = await uploadRes.json();
            const imageId = uploadData[0].id;

            // 3. Create Pin Suggestion
            const isAdmin = user?.role?.type === 'admin';

            await pinService.suggestPin({
                name,
                image: imageId,
                suggestedBy: user.id,
                status: isAdmin ? 'approved' : 'pending'
            }, token);

            onClose();
            setName("");
            setSelectedFile(null);
            setPreviewUrl(null);

        } catch (error) {
            console.error("Suggestion failed", error);
            setError("Failed to submit suggestion. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="center">
            <ModalContent>
                <ModalHeader>Suggest a New Pin</ModalHeader>
                <ModalBody>
                    <p className="text-sm text-gray-500 mb-4">
                        Suggest a mission pin. An admin will review it before it becomes available in the library.
                    </p>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Mission Name"
                            placeholder="e.g. Apollo 11"
                            value={name}
                            onValueChange={handleNameChange}
                            isRequired
                            isInvalid={!!error}
                            errorMessage={error}
                        />

                        {/* Image Upload */}
                        <div
                            className="border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 transition"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Preview" className="h-32 object-contain" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <PhotoIcon className="w-8 h-8 mb-2" />
                                    <span className="text-sm">Click to upload image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>Cancel</Button>
                    <Button color="primary" onPress={handleSubmit} isLoading={loading} isDisabled={!name || !selectedFile}>
                        Submit Suggestion
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
