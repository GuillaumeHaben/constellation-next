"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Textarea
} from "@heroui/react";
import { useState } from "react";
import { changelogService } from "@/service/changelogService";

export default function ModalCreateChangelog({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        version: "",
        date: new Date().toISOString(),
        title: "",
        description: "",
        tag: "feature"
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                date: new Date().toISOString()
            };
            await changelogService.create(token, payload);
            if (onSuccess) onSuccess();
            onClose();
            // Reset form
            setFormData({
                version: "",
                date: new Date().toISOString(),
                title: "",
                description: "",
                tag: "feature"
            });
        } catch (error) {
            console.error("Failed to create changelog:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            size="2xl"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add New Changelog</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Version"
                                    placeholder="1.0.0"
                                    value={formData.version}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, version: val }))}
                                />

                                <Input
                                    label="Title"
                                    placeholder="Feature title"
                                    value={formData.title}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, title: val }))}
                                />

                                <Select
                                    label="Tag"
                                    selectedKeys={[formData.tag]}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                                >
                                    <SelectItem key="feature" value="feature">Feature</SelectItem>
                                    <SelectItem key="bug-fix" value="bug-fix">Bug Fix</SelectItem>
                                </Select>

                                <Textarea
                                    label="Description"
                                    placeholder="Describe the changes..."
                                    value={formData.description}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                                    minRows={3}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleSubmit}
                                isLoading={loading}
                            >
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
