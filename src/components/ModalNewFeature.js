"use client";
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
import AnimatedFeature from "./AnimatedFeature";

export default function ModalNewFeature({ isOpen, onOpenChange }) {

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop="blur" size="3xl">
            <ModalContent>
                {() => (
                    <>
                        <Form className="w-full h-full flex items-center justify-center">
                            <ModalHeader>
                                <AnimatedFeature />
                            </ModalHeader>
                            <ModalBody className="flex flex-col text-center mb-20 mr-20 ml-20">
                                <h1 className="text-2xl font-bold">New Feature</h1>
                                <p className="text-md">While you've been away, we've been working hard to improve Constellation. Check out our latest update!</p>
                            </ModalBody>
                            <ModalFooter className="mb-5">
                                <Button
                                    color="primary"
                                    onPress={() => onOpenChange(false)}
                                >
                                    Got it!
                                </Button>
                            </ModalFooter>
                        </Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
