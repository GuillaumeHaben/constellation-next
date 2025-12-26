"use client";

import { Card, CardBody, Tooltip } from "@heroui/react";
import {
    UsersIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    GlobeAltIcon,
    IdentificationIcon,
    TicketIcon,
    SparklesIcon,
    PlusCircleIcon,
    HashtagIcon,
    RocketLaunchIcon,
    FlagIcon,
    WrenchScrewdriverIcon,
    LockClosedIcon,
    MagnifyingGlassCircleIcon
} from "@heroicons/react/24/outline";

const AwardTile = ({ award }) => {
    const Icon = award.icon;
    const isLocked = award.status === "locked";

    const content = (
        <div className={`
            relative aspect-square rounded-3xl flex flex-col items-center justify-center p-4 transition-all duration-500 group
            ${isLocked
                ? "bg-slate-900/50 border-2 border-slate-800/50 text-slate-600 grayscale"
                : `${award.bgGradient} border-2 border-white/10 text-white shadow-lg shadow-black/20 hover:scale-105 hover:rotate-2`
            }
        `}>
            {isLocked ? (
                <>
                    <LockClosedIcon className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">{award.name}</span>
                </>
            ) : (
                <>
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-2 group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{award.name}</span>
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                </>
            )}
        </div>
    );

    return (
        <Tooltip
            content={
                <div className="px-1 py-2">
                    <div className="text-small font-bold">{isLocked ? "Requirement" : "Achieved!"}</div>
                    <div className="text-tiny opacity-80">{award.requirement}</div>
                </div>
            }
            delay={0}
            closeDelay={0}
            motionProps={{
                variants: {
                    exit: { opacity: 0, transition: { duration: 0.1 } },
                    enter: { opacity: 1, transition: { duration: 0.1 } },
                },
            }}
        >
            <div className="cursor-default">
                {content}
            </div>
        </Tooltip>
    );
};

export default function TabAwards({ targetUser }) {
    const sections = [
        {
            title: "IRL awards",
            color: "bg-yellow-500",
            awards: [
                { id: 1, name: "Site Hopper", requirement: "Met someone from each site", status: "achieved", icon: BuildingOfficeIcon, bgGradient: "bg-gradient-to-br from-yellow-400 to-amber-600" },
                { id: 2, name: "Globetrotter", requirement: "Met someone from each member state", status: "achieved", icon: GlobeAltIcon, bgGradient: "bg-gradient-to-br from-amber-500 to-orange-600" },
                { id: 3, name: "Directorate Guru", requirement: "Met someone from each directorate", status: "locked", icon: IdentificationIcon, bgGradient: "" },
                { id: 4, name: "Socialite", requirement: "Met more than 10 colleagues", status: "achieved", icon: UserGroupIcon, bgGradient: "bg-gradient-to-br from-orange-400 to-red-600" },
                { id: 5, name: "Connector", requirement: "Met more than 50 colleagues", status: "locked", icon: UsersIcon, bgGradient: "bg-gradient-to-br from-yellow-500 to-yellow-500" },
            ]
        },
        {
            title: "Pin awards",
            color: "bg-purple-500",
            awards: [
                { id: 6, name: "Collector", requirement: "Collected more than 10 pins", status: "achieved", icon: TicketIcon, bgGradient: "bg-gradient-to-br from-purple-400 to-fuchsia-600" },
                { id: 7, name: "Hoarder", requirement: "Collected more than 50 pins", status: "achieved", icon: SparklesIcon, bgGradient: "bg-gradient-to-br from-fuchsia-500 to-pink-600" },
                { id: 8, name: "Legendary", requirement: "Collected a legendary pin", status: "achieved", icon: MagnifyingGlassCircleIcon, bgGradient: "bg-gradient-to-br from-pink-600 to-pink-800" },
            ]
        },
        {
            title: "Clubs awards",
            color: "bg-green-500",
            awards: [
                { id: 9, name: "Newbie", requirement: "Join your first club", status: "achieved", icon: PlusCircleIcon, bgGradient: "bg-gradient-to-br from-lime-400 to-green-600" },
                { id: 10, name: "Social Butterfly", requirement: "Joined 5 clubs", status: "achieved", icon: HashtagIcon, bgGradient: "bg-gradient-to-br from-green-500 to-emerald-400" },
                { id: 11, name: "Club Legend", requirement: "Joined 10 clubs", status: "achieved", icon: RocketLaunchIcon, bgGradient: "bg-gradient-to-br from-green-400 to-emerald-600" },
                { id: 12, name: "The Visionary", requirement: "Club founder", status: "achieved", icon: FlagIcon, bgGradient: "bg-gradient-to-br from-emerald-400 to-teal-600" },
                { id: 13, name: "The Shepherd", requirement: "Club manager", status: "achieved", icon: WrenchScrewdriverIcon, bgGradient: "bg-gradient-to-br from-teal-600 to-cyan-600" },
            ]
        },
        {
            title: "Young ESA awards",
            color: "bg-cyan-500",
            awards: [
                { id: 14, name: "Part of the Crew", requirement: "Belonging to a group", status: "achieved", icon: UserGroupIcon, bgGradient: "bg-gradient-to-br from-cyan-400 to-blue-600" },
                { id: 15, name: "Skipper", requirement: "Leading a group", status: "achieved", icon: RocketLaunchIcon, bgGradient: "bg-gradient-to-br from-blue-400 to-sky-600" },
                { id: 16, name: "Expedition Leader", requirement: "Trip organizer", status: "achieved", icon: GlobeAltIcon, bgGradient: "bg-gradient-to-br from-sky-500 to-blue-700" },
                { id: 17, name: "Star Guide", requirement: "Open days benevol", status: "achieved", icon: SparklesIcon, bgGradient: "bg-gradient-to-br from-blue-600 to-indigo-800" },
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-12 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {sections.map((section) => (
                <div key={section.title} className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <div className={`w-1.5 h-6 ${section.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                        <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.2em]">{section.title}</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {section.awards.map((award) => (
                            <AwardTile key={award.id} award={award} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
