"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@heroui/react";

export default function ConnectionsInfoModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col">Understanding IRL Connections</ModalHeader>
                <ModalBody>
                    <p className="text-sm text-gray-400 mb-2">
                        IRL connections are a way to connect with other users in real life. <br />
                        Show your QR code to your colleagues to connect with them. <br />
                        Earn awards for connecting with people from different countries and ESA sites.
                    </p>
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
