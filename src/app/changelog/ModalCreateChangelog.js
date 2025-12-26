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
import { useState, useEffect } from "react";
import { changelogService } from "@/service/changelogService";

export default function ModalCreateChangelog({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [incrementType, setIncrementType] = useState("minor"); // default to minor
    const [latestVersion, setLatestVersion] = useState(null);
    const [nextVersion, setNextVersion] = useState("0.1.0");

    const [formData, setFormData] = useState({
        date: new Date().toISOString(),
        title: "",
        description: "",
        tag: "feature"
    });

    // Semantic Versioning Logic
    const calculateNextVersion = (currentVersion, type) => {
        if (!currentVersion) return "0.1.0";

        const parts = currentVersion.split('.').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) {
            // Fallback if version string is malformed
            return currentVersion;
        }

        let [major, minor, patch] = parts;

        switch (type) {
            case "major":
                major++;
                minor = 0;
                patch = 0;
                break;
            case "minor":
                minor++;
                patch = 0;
                break;
            case "patch":
                patch++;
                break;
        }

        return `${major}.${minor}.${patch}`;
    };

    // Fetch latest version on mount
    useEffect(() => {
        if (isOpen) {
            const fetchLatest = async () => {
                const token = localStorage.getItem("token");
                try {
                    const latest = await changelogService.getLatest(token);
                    const currentVer = latest ? latest.version : null;
                    setLatestVersion(currentVer);
                    setNextVersion(calculateNextVersion(currentVer, incrementType));
                } catch (err) {
                    console.error("Failed to fetch latest version:", err);
                    // defaults to 0.1.0 if fetch fails or no version
                    setNextVersion("0.1.0");
                }
            };
            fetchLatest();
        }
    }, [isOpen, incrementType]);

    // Recalculate when increment type changes
    useEffect(() => {
        setNextVersion(calculateNextVersion(latestVersion, incrementType));
    }, [incrementType, latestVersion]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                version: nextVersion,
                date: new Date().toISOString()
            };
            await changelogService.create(token, payload);
            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error("Failed to create changelog:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset form
        setFormData({
            date: new Date().toISOString(),
            title: "",
            description: "",
            tag: "feature"
        });
        setIncrementType("minor");
        setLatestVersion(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={handleClose}
            size="2xl"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add New Changelog</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                {/* Versioning Section */}
                                <div className="p-4 bg-default-100 rounded-lg space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-default-500">Latest Version: <span className="font-mono font-bold text-default-700">{latestVersion || "None"}</span></span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">New Version:</span>
                                            <span className="px-2 py-1 bg-primary/10 text-primary font-mono font-bold rounded">{nextVersion}</span>
                                        </div>
                                    </div>

                                    <Select
                                        label="Increment Type"
                                        selectedKeys={[incrementType]}
                                        onChange={(e) => setIncrementType(e.target.value)}
                                        disallowEmptySelection
                                    >
                                        <SelectItem key="major" value="major">Major (1.0.0)</SelectItem>
                                        <SelectItem key="minor" value="minor">Minor (0.1.0)</SelectItem>
                                        <SelectItem key="patch" value="patch">Patch (0.0.1)</SelectItem>
                                    </Select>
                                </div>

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
                            <Button color="danger" variant="light" onPress={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleSubmit}
                                isLoading={loading}
                            >
                                Create {nextVersion}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
