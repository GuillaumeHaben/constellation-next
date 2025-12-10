"use client";
import { useState, useEffect } from "react";
import {
    Form,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from "@heroui/react";

export function ModalClub({ isOpen, onOpenChange, onCreate, onUpdate, initialData }) {
    const isEditMode = Boolean(initialData);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Prefill data when editing
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [initialData]);

    const handleSubmit = async (e, internalOnClose) => {
        const form = e?.target?.form;
        if (!form?.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            if (isEditMode && onUpdate) {
                await onUpdate(initialData.documentId, name, description);
            } else if (onCreate) {
                await onCreate(name, description);
            }
            internalOnClose?.();
            setName("");
            setDescription("");
        } catch (err) {
            console.error("Failed to submit form:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                {(internalOnClose) => (
                    <>
                        <Form>
                            <ModalHeader className="flex flex-col gap-1">
                                {isEditMode ? "Edit Club" : "Create Club"}
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Name"
                                    isRequired
                                    placeholder="Enter the club's name"
                                    variant="bordered"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    label="Description"
                                    isRequired
                                    placeholder="Enter a short description for the club's purpose"
                                    variant="bordered"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={() => internalOnClose?.()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color={isEditMode ? "warning" : "success"}
                                    onPress={(e) => handleSubmit(e, internalOnClose)}
                                >
                                    {isEditMode ? "Update Club" : "Create Club"}
                                </Button>
                            </ModalFooter>
                        </Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
