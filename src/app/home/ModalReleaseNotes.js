"use client";

import {
    Form,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import AnimatedFeature from "@/components/AnimatedFeature";

export default function ModalReleaseNotes({ isOpen, onClose, changelog }) {
    if (!changelog) return null;

    return (
        <Modal
            isOpen={isOpen}
            placement="top-center"
            onOpenChange={onClose}
            backdrop="blur"
            size="3xl"
            hideCloseButton={true}
            isDismissable={false}
        >
            <ModalContent>
                {() => (
                    <>
                        <Form className="w-full h-full flex items-center justify-center">
                            <ModalHeader className="p-0 pt-6">
                                <AnimatedFeature />
                            </ModalHeader>
                            <ModalBody className="flex flex-col text-center mb-10 mr-20 ml-20">
                                <h1 className="text-2xl font-bold mb-2">We've been working hard while you were away!</h1>
                                <span className="text-sm text-slate-400">
                                    {new Date(changelog.createdAt || changelog.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>

                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-lg font-semibold mb-2">{changelog.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {changelog.description}
                                    </p>
                                </div>
                            </ModalBody>
                            <ModalFooter className="mb-5 w-full flex justify-center">
                                <Button
                                    color="primary"
                                    onPress={onClose}
                                    className="w-full max-w-md font-semibold shadow-lg shadow-blue-500/20"
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
