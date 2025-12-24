import { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import {
    UsersIcon,
    GlobeAltIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    MapPinIcon,
    UserPlusIcon,
    LanguageIcon,
    TrophyIcon
} from "@heroicons/react/24/outline";
import { userService } from "@/service/userService";
import { pinService } from "@/service/pinService";
import Link from 'next/link';

export default function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const [users, totalEncounters] = await Promise.all([
                    userService.getAll(token),
                    userService.getTotalEncounters(token)
                ]);

                // 1. Total & New Users
                const now = new Date();
                const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

                const totalUsers = users.length;
                const newUsersCount = users.filter(u => new Date(u.createdAt) > sevenDaysAgo).length;

                // 2. Frequency helpers
                const getMostFrequent = (arr) => {
                    if (!arr.length) return null;
                    const counts = arr.reduce((acc, val) => {
                        if (val) acc[val] = (acc[val] || 0) + 1;
                        return acc;
                    }, {});
                    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
                };

                const mostCountry = getMostFrequent(users.map(u => u.country));
                const mostSite = getMostFrequent(users.map(u => u.esaSite));
                const mostPosition = getMostFrequent(users.map(u => u.position));
                const mostDirectorate = getMostFrequent(users.map(u => u.directorate));

                // 3. User with most pins
                const userPinCounts = {};
                users.forEach(u => {
                    // Strapi v5 populated relations are directly on the object as arrays
                    // We only want to count unique 'approved' pins
                    const approvedPins = Array.isArray(u.pins)
                        ? u.pins.filter(p => p.status === 'approved')
                        : [];

                    // Use a Set to ensure we only count unique pin IDs
                    const uniquePinIds = new Set(approvedPins.map(p => p.id));
                    userPinCounts[u.id] = uniquePinIds.size;
                });

                const counts = Object.values(userPinCounts);
                const maxPins = counts.length > 0 ? Math.max(...counts) : 0;

                const topUsers = users
                    .filter(u => userPinCounts[u.id] === maxPins && maxPins > 0)
                    .sort((a, b) => {
                        const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
                        const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
                        return nameA.localeCompare(nameB);
                    });

                const topUser = topUsers[0] || null;
                const topUserName = topUser
                    ? `${topUser.firstName || ""} ${topUser.lastName || ""}`.trim() || topUser.username
                    : "None yet";

                setStats({
                    totalUsers,
                    newUsersCount,
                    mostCountry,
                    mostSite,
                    mostPosition,
                    topUserName,
                    topUserPins: maxPins,
                    topUserSlug: topUser?.slug,
                    mostLanguage: "English", // Mocked as requested for first draft
                    mostDirectorate,
                    totalEncounters
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-12">
            <Spinner label="Loading Constellation Insight..." color="primary" />
        </div>
    );

    if (!stats) return (
        <div className="flex justify-center p-12 text-slate-400">
            Failed to load stats. Please try again later.
        </div>
    );

    const statCards = [
        {
            title: "Community Size",
            value: stats.totalUsers,
            sub: `${stats.newUsersCount} new this week`,
            icon: UsersIcon,
            color: "from-blue-500/10 to-indigo-500/10",
            border: "border-blue-500/20"
        },
        {
            title: "Top Country",
            value: stats.mostCountry || "N/A",
            sub: "Most represented",
            icon: GlobeAltIcon,
            color: "from-emerald-500/10 to-teal-500/10",
            border: "border-emerald-500/20"
        },
        {
            title: "Top Site",
            value: stats.mostSite || "N/A",
            sub: "Highest density",
            icon: MapPinIcon,
            color: "from-orange-500/10 to-amber-500/10",
            border: "border-orange-500/20"
        },
        {
            title: "Top Pin Collector",
            value: stats.topUserName,
            sub: `${stats.topUserPins} pins collected`,
            icon: TrophyIcon,
            color: "from-purple-500/10 to-pink-500/10",
            border: "border-purple-500/20",
            href: stats.topUserSlug ? `/user/${stats.topUserSlug}` : null
        },
        {
            title: "Most Spoken",
            value: stats.mostLanguage,
            sub: "Main language",
            icon: LanguageIcon,
            color: "from-cyan-500/10 to-blue-500/10",
            border: "border-cyan-500/20"
        },
        {
            title: "Common Position",
            value: stats.mostPosition || "N/A",
            sub: "Directorate / Lead",
            icon: AcademicCapIcon,
            color: "from-slate-500/10 to-slate-400/10",
            border: "border-slate-500/20"
        },
        {
            title: "Top Directorate",
            value: stats.mostDirectorate || "N/A",
            sub: "Most represented",
            icon: BriefcaseIcon,
            color: "from-indigo-500/10 to-violet-500/10",
            border: "border-indigo-500/20"
        },
        {
            title: "Total Encounters",
            value: stats.totalEncounters ?? "-",
            sub: "IRL connections",
            icon: UserPlusIcon,
            color: "from-green-500/10 to-emerald-500/10",
            border: "border-green-500/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {statCards.map((card, i) => {
                const CardContent = (
                    <CardBody className="p-6 relative overflow-hidden group">
                        {/* Decorative background icon */}
                        <card.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-500" />

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <card.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="text-2xl font-black text-white tracking-tight truncate">{card.value}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">{card.sub}</span>
                        </div>
                    </CardBody>
                );

                return (
                    <Card key={i} className={`bg-gradient-to-br ${card.color} ${card.border} border shadow-xl backdrop-blur-md hover:scale-[1.02] transition-transform duration-300`}>
                        {card.href ? (
                            <Link href={card.href}>
                                {CardContent}
                            </Link>
                        ) : (
                            CardContent
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
