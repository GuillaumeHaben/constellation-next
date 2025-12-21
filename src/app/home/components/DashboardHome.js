import { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import {
    UsersIcon,
    GlobeAltIcon,
    BriefcaseIcon,
    MapPinIcon,
    CalendarIcon,
    LanguageIcon,
    TrophyIcon
} from "@heroicons/react/24/outline";
import { userService } from "@/service/userService";
import { pinService } from "@/service/pinService";

export default function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const [users, pins] = await Promise.all([
                    userService.getAll(token),
                    pinService.getAllApproved(token)
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

                // 3. User with most pins
                // This is slightly complex since one pin has multiple users
                const userPinCounts = {};
                pins.forEach(pin => {
                    if (pin.users) {
                        pin.users.forEach(u => {
                            userPinCounts[u.id] = (userPinCounts[u.id] || 0) + 1;
                        });
                    }
                });

                let topUserId = null;
                let maxPins = 0;
                Object.entries(userPinCounts).forEach(([id, count]) => {
                    if (count > maxPins) {
                        maxPins = count;
                        topUserId = parseInt(id);
                    }
                });

                const topUser = topUserId ? users.find(u => u.id === topUserId) : null;
                const topUserName = topUser ? `${topUser.firstName} ${topUser.lastName}` : "None yet";

                setStats({
                    totalUsers,
                    newUsersCount,
                    mostCountry,
                    mostSite,
                    mostPosition,
                    topUserName,
                    topUserPins: maxPins,
                    mostLanguage: "English" // Mocked as requested for first draft
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
            border: "border-purple-500/20"
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
            icon: BriefcaseIcon,
            color: "from-slate-500/10 to-slate-400/10",
            border: "border-slate-500/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {statCards.map((card, i) => (
                <Card key={i} className={`bg-gradient-to-br ${card.color} ${card.border} border shadow-xl backdrop-blur-md`}>
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
                            <div className="mt-2">
                                <span className="text-2xl font-black text-white tracking-tight">{card.value}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">{card.sub}</span>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
