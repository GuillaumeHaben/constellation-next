"use client";

import { useEffect, useState } from "react";
import { userService } from "@/service/userService";
import { useAuth } from "@/context/AuthContext";
import { Card, CardBody, Avatar } from "@heroui/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@heroui/react";
import { getProfilePictureUrl } from "@/utils/media";
import ConnectionsInfoModal from "./ConnectionsInfoModal";

export default function TabIRL({ targetUser }) {
    const { user } = useAuth();
    const [encounterCount, setEncounterCount] = useState(0);
    const [encounteredUsers, setEncounteredUsers] = useState([]);
    const [isLoadingEncounters, setIsLoadingEncounters] = useState(true);
    const [showConnectionsInfo, setShowConnectionsInfo] = useState(false);

    const isOwnProfile = user && targetUser && user.slug === targetUser.slug;

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token || !targetUser?.id) {
                setEncounterCount(0);
                setEncounteredUsers([]);
                setIsLoadingEncounters(false);
                return;
            }

            const [countResult, usersResult] = await Promise.allSettled([
                userService.getEncountersCount(targetUser.id, token),
                userService.getEncounteredUsers(targetUser.id, token)
            ]);

            if (!isMounted) return;

            if (countResult.status === "fulfilled") {
                setEncounterCount(countResult.value);
            }

            if (usersResult.status === "fulfilled") {
                setEncounteredUsers(usersResult.value);
            } else {
                setEncounteredUsers([]);
            }

            setIsLoadingEncounters(false);
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // 30 seconds

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [targetUser?.id]);

    return (
        <div className="flex flex-col gap-6 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Stats Card */}
                <Card className="md:col-span-3 bg-gradient-to-br to-yellow-400/20 from-amber-500/20 border-yellow-400/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
                    <CardBody className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-yellow-400 rounded-2xl shadow-xl shadow-yellow-600/40">
                                    <UsersIcon className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-yellow-200/70 text-sm font-bold uppercase tracking-widest">IRL Connections</h3>
                                    <p className="text-5xl font-black text-white mt-1">{encounterCount}</p>
                                </div>
                            </div>

                            <div className="text-center md:text-right">
                                <p className="text-yellow-100/60 text-sm mb-2 font-medium">IRL Connections Info</p>
                                <Tooltip content="Learn about IRL connections" placement="left">
                                    <button
                                        onClick={() => setShowConnectionsInfo(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 font-bold hover:bg-yellow-500/30 transition-colors"
                                    >
                                        <InformationCircleIcon className="w-5 h-5" />
                                        How it works
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="mt-6">
                <div className="mt-6">
                    {encounteredUsers.length > 0 && (
                        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Crew</h3>
                        </div>
                    )}
                    {isLoadingEncounters ? (
                        <div className="text-center text-slate-500 border border-dashed border-slate-700/50 rounded-2xl py-6">
                            Loading encounters...
                        </div>
                    ) : encounteredUsers.length === 0 ? (
                        isOwnProfile ? (
                            <div className="text-center text-slate-500 border border-dashed border-slate-700/50 rounded-2xl py-8">
                                No IRL encounters recorded yet. Grab a QR and meet someone!
                            </div>
                        ) : null
                    ) : (
                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                            {encounteredUsers.slice(0, 18).map((person) => {
                                const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ") || person.username || "Constellation Explorer";
                                const profileHref = person.slug ? `/user/${person.slug}` : `#`; // fallback if slug missing
                                const avatarSrc = getProfilePictureUrl(person);

                                return (
                                    <Link
                                        key={person.id}
                                        href={profileHref}
                                        className="group flex flex-col items-center gap-2 transition-transform duration-200 hover:-translate-y-1"
                                    >
                                        <Avatar
                                            src={avatarSrc || undefined}
                                            name={fullName.charAt(0).toUpperCase()}
                                            className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800/70 text-white text-lg"
                                            radius="full"
                                        />
                                        <span className="text-xs font-semibold text-slate-300 text-center group-hover:text-white transition-colors max-w-[6rem] truncate">
                                            {fullName}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}


                    <ConnectionsInfoModal
                        isOpen={showConnectionsInfo}
                        onClose={() => setShowConnectionsInfo(false)}
                    />
                </div>
            </div>
        </div>
    );
}