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
            isDismissable={true}
        >
            <ModalContent>
                {() => (
                    <>
                        <Form className="w-full h-full flex items-center justify-center">
                            <ModalHeader className="p-0 pt-6">
                                <AnimatedFeature />
                            </ModalHeader>
                            <ModalBody className="flex flex-col text-center mb-10 px-6 sm:px-12 w-full">
                                <h1 className="text-2xl font-bold mb-2">We&apos;ve been working hard while you were away!</h1>
                                {/* Feature Card */}
                                <div className="mt-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                                    {/* Decorative background effects */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                                    {/* Header: Version & Date */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-700/50 pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono font-bold border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                v{changelog.version}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                                                {new Date(changelog.createdAt || changelog.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-left relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                            {changelog.title}
                                        </h3>
                                        <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
                                            {changelog.description}
                                        </p>
                                    </div>
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
