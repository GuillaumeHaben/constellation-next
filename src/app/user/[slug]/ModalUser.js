"use client";

import { useState } from "react";
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
} from "@heroui/react";
import { userService } from "@/service/userService";

// Constants for dropdown options
const ESA_SITES = ["ESTEC", "HQ", "ESOC", "ESAC", "ESRIN", "EAC", "Space Port", "ESEC", "ECSAT"];
const DIRECTORATES = ["TEC", "NAV", "DG", "RES", "CIC", "SCI", "STS", "SLE", "HRE", "EOP", "OPS", "CSC"];
const COUNTRIES = [
    "Austria", "Belgium", "Czech Republic", "Denmark", "Estonia", "Finland", "France",
    "Germany", "Greece", "Hungary", "Ireland", "Italy", "Luxembourg", "Netherlands",
    "Norway", "Poland", "Portugal", "Romania", "Slovenia", "Spain", "Sweden",
    "Switzerland", "United Kingdom"
];
const POSITIONS = ["Intern", "YGT", "IRF", "JP", "Staff", "Contractor", "Visiting researcher"];

export function ModalUser({ isOpen, setIsModalOpen, editForm, setEditForm, targetUser, setTargetUser }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            await userService.update(targetUser.id, editForm, token);
            setTargetUser({ ...targetUser, ...editForm });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={setIsModalOpen}
            size="3xl"
            scrollBehavior="inside"
            backdrop="blur"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        />
                        <Input
                            label="Last Name"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        />
                        <Input
                            label="Birthday"
                            type="date"
                            value={editForm.birthday}
                            onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                        />
                        <Select
                            label="Country of origin"
                            selectedKeys={editForm.country ? [editForm.country] : []}
                            onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                        >
                            {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                    {country}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="ESA Site"
                            selectedKeys={editForm.esaSite ? [editForm.esaSite] : []}
                            onChange={(e) => setEditForm({ ...editForm, esaSite: e.target.value })}
                        >
                            {ESA_SITES.map((site) => (
                                <SelectItem key={site} value={site}>
                                    {site}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Directorate"
                            selectedKeys={editForm.directorate ? [editForm.directorate] : []}
                            onChange={(e) => setEditForm({ ...editForm, directorate: e.target.value })}
                        >
                            {DIRECTORATES.map((dir) => (
                                <SelectItem key={dir} value={dir}>
                                    {dir}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Position at ESA"
                            selectedKeys={editForm.position ? [editForm.position] : []}
                            onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        >
                            {POSITIONS.map((pos) => (
                                <SelectItem key={pos} value={pos}>
                                    {pos}
                                </SelectItem>
                            ))}
                        </Select>
                        <Input
                            label="Phone Number"
                            value={editForm.phoneNumber}
                            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        />
                        {/* <Input
                            label="Work Domain"
                            value={editForm.workDomain}
                            onChange={(e) => setEditForm({ ...editForm, workDomain: e.target.value })}
                        /> */}
                        <Input
                            label="Address"
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            className="md:col-span-2"
                        />
                        <Input
                            label="Instagram"
                            placeholder="https://instagram.com/username"
                            value={editForm.instagram}
                            onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                        />
                        <Input
                            label="LinkedIn"
                            placeholder="https://linkedin.com/in/username"
                            value={editForm.linkedin}
                            onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                        />
                        <Input
                            label="Facebook"
                            placeholder="https://facebook.com/username"
                            value={editForm.facebook}
                            onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
                        />
                        <Input
                            label="X (Twitter)"
                            placeholder="https://x.com/username"
                            value={editForm.twitter}
                            onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                        />
                        <Input
                            label="GitHub"
                            placeholder="https://github.com/username"
                            value={editForm.github}
                            onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                        />
                        <Input
                            label="Website"
                            placeholder="https://website.io"
                            value={editForm.website}
                            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)} isDisabled={isLoading}>
                        Cancel
                    </Button>
                    <Button color="primary" onPress={handleSaveProfile} isLoading={isLoading}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
