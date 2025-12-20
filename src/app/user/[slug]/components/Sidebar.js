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
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-600 relative overflow-hidden group">
            {/* Decorative background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500"></div>

            <CardBody className="flex flex-col items-center gap-4 p-6 relative z-10">
                <div className="relative group/avatar">
                    <Avatar
                        src={getProfilePictureUrl(targetUser)}
                        className="w-32 h-32 transition-transform duration-300 group-hover/avatar:scale-105"
                        isBordered
                        radius="full"
                        color="primary"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <Spinner color="white" />
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {targetUser.firstName} {targetUser.lastName}
                    </h2>
                    <p className="text-slate-400 mt-1 font-medium text-sm tracking-wide uppercase">{targetUser.position || "ESA Member"}, {targetUser.esaSite || "ESA"}</p>
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
                                onPress={() => fileInputRef.current?.click()}
                                className="flex-1 font-semibold"
                                isDisabled={isUploading}
                            >
                                <CameraIcon className="w-4 h-4 mr-2" />
                                Picture
                            </Button>
                            <Button
                                color="primary"
                                variant="flat"
                                onPress={handleEditClick}
                                className="flex-1 font-semibold"
                            >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
