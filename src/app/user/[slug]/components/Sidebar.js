"use client";

import { useEffect, useState, useRef } from "react";
import {
    Card,
    CardBody,
    Avatar,
    Spinner,
    Button,
    Badge
} from "@heroui/react";
import { CameraIcon, PencilIcon, QrCodeIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getProfilePictureUrl } from "@/utils/media";
import ProgressBar from "../progressBar";
import { userService } from "@/service/userService";

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "a while ago";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};

export default function Sidebar({
    targetUser,
    isOwnProfile,
    isUploading,
    handleFileChange,
    fileInputRef,
    handleEditClick
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [qrToken, setQrToken] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const qrRef = useRef(null);
    const qrInstance = useRef(null);
    const [QRCodeStyling, setQRCodeStyling] = useState(null);

    const flipStyles = {
        transformStyle: "preserve-3d",
        transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        willChange: "transform",
    };

    // Load QR library only on client
    useEffect(() => {
        import("qr-code-styling").then((mod) => {
            setQRCodeStyling(() => mod.default);
        });
    }, []);

    // QR Token Logic - Only fetch if isFlipped
    useEffect(() => {
        if (!isOwnProfile || !isFlipped) return;

        const fetchToken = async () => {
            try {
                const token = localStorage.getItem("token");
                const { token: newQrToken } = await userService.getEncounterToken(token);
                setQrToken(newQrToken);
                setTimeLeft(30); // Reset timer on new token
            } catch (error) {
                console.error("Failed to fetch QR token:", error);
            }
        };

        fetchToken();
        const interval = setInterval(fetchToken, 30000);
        return () => clearInterval(interval);
    }, [isOwnProfile, isFlipped]);

    // Countdown Timer logic
    useEffect(() => {
        if (!isFlipped || !qrToken) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isFlipped, qrToken]);
    // Render QR Code
    useEffect(() => {
        if (!qrToken || !qrRef.current || !QRCodeStyling) return;

        const qrValue = `${window.location.origin}/meet?t=${qrToken}`;

        if (!qrInstance.current) {
            qrInstance.current = new QRCodeStyling({
                width: 240,
                height: 240,
                qrOptions: { errorCorrectionLevel: "Q" },
                type: "svg",
                image: "/img/icon.png",
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 7
                },
                data: qrValue,
                dotsOptions: {
                    type: "extra-rounded",
                    color: "#ddd"
                },
                backgroundOptions: {
                    color: "transparent"
                },
                cornersSquareOptions: {
                    type: "extra-rounded",
                    color: "#ddd"
                },
                cornersDotOptions: {
                    color: "#ddd"
                }
            });
            if (qrRef.current) {
                qrRef.current.innerHTML = "";
                qrInstance.current.append(qrRef.current);
            }
        } else {
            qrInstance.current.update({ data: qrValue });
        }
    }, [qrToken, QRCodeStyling]);

    const getAgeDisplay = (birthdayStr) => {
        if (!birthdayStr) return null;
        const date = new Date(birthdayStr);
        if (isNaN(date)) return null;
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const hasHadBirthdayThisYear = (today.getMonth() > date.getMonth()) || (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
        if (!hasHadBirthdayThisYear) age--;
        const isBirthdayToday = today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
        return `${isBirthdayToday ? ' 🎂' : ''} ${age} years old`;
    };

    const toggleFlip = () => setIsFlipped(!isFlipped);
    const ageDisplay = getAgeDisplay(targetUser.birthday);

    return (
        <div
            className="w-full min-h-[500px] flex flex-col relative"
            style={{ perspective: "2000px" }}
        >
            <div className="relative w-full min-h-[500px]" style={flipStyles}>
                <div
                    className={`absolute inset-0 flex flex-col ${isFlipped ? "pointer-events-none" : "pointer-events-auto"}`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)", opacity: isFlipped ? 0 : 1, transition: "opacity 0.35s ease" }}
                    aria-hidden={isFlipped}
                >
                    <Card className="flex-1 h-full bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500"></div>

                        <CardBody className="flex flex-col p-8 relative z-10 h-full">
                            {/* Profile Info Section - Centered vertically in the available space */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                <div className="relative group/avatar">
                                    <Avatar
                                        src={getProfilePictureUrl(targetUser)}
                                        className="w-32 h-32 transition-transform duration-300 group-hover/avatar:scale-105 shadow-xl shadow-blue-500/20"
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
                                <div className="flex flex-col items-center">

                                    {/* Last Seen Status */}
                                    <div className="py-1 px-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                        {targetUser.lastSeenAt && (new Date() - new Date(targetUser.lastSeenAt) < 300000) ? (
                                            <>
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Online Now</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Last seen {targetUser.lastSeenAt ? formatTimeAgo(targetUser.lastSeenAt) : "a while ago"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        {targetUser.firstName} {targetUser.lastName}
                                    </h2>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center flex-wrap justify-center">
                                            {ageDisplay && <p className="text-slate-400 font-semibold text-xs tracking-widest">{ageDisplay}</p>}
                                            {/* <p className="text-blue-400 font-semibold text-xs tracking-widest uppercase">{targetUser.position || "ESA Member"}</p> */}
                                        </div>
                                        {/* <p className="text-slate-500 font-medium text-xs tracking-wide">{targetUser.esaSite || "ESA"}</p> */}

                                    </div>
                                </div>

                                {isOwnProfile && (
                                    <div className="w-full space-y-4">
                                        <div className="px-2">
                                            <ProgressBar targetUser={targetUser} />
                                        </div>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />

                                        <div className="grid grid-cols-2 gap-3 pb-2">
                                            <Button
                                                color="secondary"
                                                variant="flat"
                                                onPress={() => fileInputRef.current?.click()}
                                                className="font-bold h-10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                                                isDisabled={isUploading}
                                            >
                                                <CameraIcon className="w-4 h-4 mr-2" />
                                                Pic
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="flat"
                                                onPress={handleEditClick}
                                                className="font-bold h-10 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                                            >
                                                <PencilIcon className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Button - Pushed to bottom for flip alignment */}
                            {isOwnProfile && (
                                <div className="mt-4">
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        onPress={toggleFlip}
                                        className="w-full h-12 font-black bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-900/40 text-sm uppercase tracking-wider"
                                    >
                                        <QrCodeIcon className="w-5 h-5 mr-3" />
                                        Scan Me
                                    </Button>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                <div
                    className={`absolute inset-0 flex flex-col ${isFlipped ? "pointer-events-auto" : "pointer-events-none"}`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", opacity: isFlipped ? 1 : 0, transition: "opacity 0.35s ease" }}
                    aria-hidden={!isFlipped}
                >
                    <Card className="flex-1 h-full bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                        <CardBody className="flex flex-col p-8 h-full">
                            {/* QR Content Section - Centered vertically */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-2">
                                <div ref={qrRef} className="rounded-xl overflow-hidden min-h-[240px] flex items-center justify-center">
                                    {!qrToken && (
                                        <div className="flex flex-col items-center gap-3">
                                            <Spinner color="primary" size="lg" />
                                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Generating...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-2 mt-2">
                                <h3 className="text-lg font-bold text-white tracking-tight">Profile QR Code</h3>
                                {/* Timer Progress Bar */}
                                {qrToken && (
                                    <div className="w-full px-4">
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                                    }`}
                                                style={{ width: `${(timeLeft / 30) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                            <span className={timeLeft <= 5 ? 'text-red-400' : 'text-blue-400/70'}>Token Security</span>
                                            <span className={timeLeft <= 5 ? 'text-red-400' : 'text-slate-500'}>{timeLeft}sec left</span>
                                        </div>
                                    </div>
                                )}
                                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                    Show this to create a new connection.
                                </p>
                            </div>

                            {/* Go Back Button - Positioned exactly where "Scan Me" is on the front */}
                            <div className="mt-4">
                                <Button
                                    variant="flat"
                                    color="primary"
                                    onPress={toggleFlip}
                                    className="w-full h-12 font-black bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm uppercase tracking-wider"
                                >
                                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                                    Back
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
