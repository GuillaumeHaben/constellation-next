"use client";

import {
    Card,
    CardBody,
    Avatar,
    Spinner,
    Button
} from "@heroui/react";
import { CameraIcon, PencilIcon } from "@heroicons/react/24/solid";
import { getProfilePictureUrl } from "@/utils/media";
import ProgressBar from "../progressBar";

export default function Sidebar({
    targetUser,
    isOwnProfile,
    isUploading,
    handleFileChange,
    fileInputRef,
    handleEditClick
}) {
    return (
        <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow hover:border-slate-600">
            <CardBody className="flex flex-col items-center gap-4 p-6">
                <div className="relative">
                    <Avatar
                        src={getProfilePictureUrl(targetUser)}
                        className="w-32 h-32"
                        isBordered
                        radius="full"
                        color="default"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <Spinner color="white" />
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">
                        {targetUser.firstName} {targetUser.lastName}
                    </h2>
                    <p className="text-gray-400 mt-1">{targetUser.position || "ESA Member"}, {targetUser.esaSite || "ESA"}</p>
                </div>
                {isOwnProfile && (
                    <>
                        <ProgressBar targetUser={targetUser} />

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <div className="flex gap-2 w-full mt-2">
                            <Button
                                color="secondary"
                                variant="flat"
                                startContent={<CameraIcon className="w-4 h-4" />}
                                onPress={() => fileInputRef.current?.click()}
                                className="flex-1"
                                isDisabled={isUploading}
                            >
                                Picture
                            </Button>
                            <Button
                                color="primary"
                                variant="flat"
                                startContent={<PencilIcon className="w-4 h-4" />}
                                onPress={handleEditClick}
                                className="flex-1"
                            >
                                Edit
                            </Button>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
