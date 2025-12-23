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
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async () => {
        if (!name || !selectedFile) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            // 1. Upload image
            // We use userService.upload as a generic uploader, assuming it works for any ref or generic upload
            // But userService.upload is specific to user profile picture (ref='plugin::users-permissions.user'). 
            // We need a generic upload. 
            // pinService doesn't have upload. Let's make a generic upload here or reuse userService if we assume it can be adapted.
            // Looking at userService.upload: it hardcodes ref/refId/field. 
            // I should probably refrain from using userService.upload for Pins.
            // I'll implement a simple upload fetch here or add a generic upload to pinService/userService.
            // For now, inline generic upload to avoid breaking changes in userService.

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


            // 2. Create Pin Suggestion
            const isAdminOrManager = user?.role?.type === 'admin' || user?.role?.type === 'manager';

            await pinService.suggestPin({
                name,
                image: imageId,
                suggestedBy: user.id,
                status: isAdminOrManager ? 'approved' : 'pending'
            }, token);

            onClose();
            setName("");
            setSelectedFile(null);
            setPreviewUrl(null);

        } catch (error) {
            console.error("Suggestion failed", error);
            alert("Failed to submit suggestion.");
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
                            onValueChange={setName}
                            isRequired
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
