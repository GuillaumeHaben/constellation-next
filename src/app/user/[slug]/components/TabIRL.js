"use client";

import { useEffect, useState } from "react";
import { userService } from "@/service/userService";
import { Card, CardBody } from "@heroui/react";
import { UsersIcon, ChartBarIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Quote from "@/components/Quote";

export default function TabIRL({ targetUser }) {
    const [encounterCount, setEncounterCount] = useState(0);

    useEffect(() => {
        const fetchCount = () => {
            const token = localStorage.getItem("token");
            if (token && targetUser) {
                userService.getEncountersCount(targetUser.id, token)
                    .then(setEncounterCount)
                    .catch(console.error);
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [targetUser]);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="hidden md:block md:col-span-3">
                    <Quote text="Life is beautiful not because of the things we see or the things we do. Life is beautiful because of the people we meet" author="Simon Sinek" authorTitle="Inspirational Speaker" picture="/img/simon-sinek.jpg" />
                </div>
                {/* Main Stats Card */}
                <Card className="md:col-span-3 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/30 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
                    <CardBody className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/40">
                                    <UsersIcon className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-blue-200/70 text-sm font-bold uppercase tracking-widest">IRL Connections</h3>
                                    <p className="text-5xl font-black text-white mt-1">{encounterCount}</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-blue-100/60 text-sm mb-2 font-medium">Platform Rank</p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold">
                                    <ChartBarIcon className="w-5 h-5" />
                                    Explorer
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Placeholder for future stats */}
                <Card className="bg-slate-800/40 border-slate-700/50 rounded-2xl">
                    <CardBody className="p-6 flex flex-col items-center text-center gap-2">
                        <CalendarIcon className="w-8 h-8 text-slate-500" />
                        <div>
                            <p className="text-white font-semibold">Last Connection</p>
                            <p className="text-slate-400 text-sm">Coming soon</p>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-slate-800/40 border-slate-700/50 rounded-2xl">
                    <CardBody className="p-6 flex flex-col items-center text-center gap-2">
                        <UsersIcon className="w-8 h-8 text-slate-500" />
                        <div>
                            <p className="text-white font-semibold">Weekly Goal</p>
                            <p className="text-slate-400 text-sm">3 / 5 met</p>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-slate-800/40 border-slate-700/50 rounded-2xl">
                    <CardBody className="p-6 flex flex-col items-center text-center gap-2">
                        <ChartBarIcon className="w-8 h-8 text-slate-500" />
                        <div>
                            <p className="text-white font-semibold">Activity Level</p>
                            <p className="text-slate-400 text-sm">Very High</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}