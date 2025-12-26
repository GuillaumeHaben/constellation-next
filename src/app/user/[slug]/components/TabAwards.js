import { useState, useEffect } from "react";
import { Tooltip } from "@heroui/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import * as HeroIcons from "@heroicons/react/24/outline";
import { awardService } from "@/service/awardService";

// Gradient mapping by category
const CATEGORY_GRADIENTS = {
    irl: "bg-gradient-to-br from-yellow-400 to-orange-600",
    pin: "bg-gradient-to-br from-purple-400 to-fuchsia-600",
    club: "bg-gradient-to-br from-green-400 to-emerald-600",
    special: "bg-gradient-to-br from-cyan-400 to-blue-600",
};

const AwardTile = ({ award }) => {
    const Icon = award.icon;
    const isLocked = award.status === "locked";

    // Use category-based gradient or fallback
    const gradientClass = CATEGORY_GRADIENTS[award.category] || "bg-slate-800";

    const content = (
        <div className={`
            relative aspect-square rounded-3xl flex flex-col items-center justify-center p-4 transition-all duration-500 group
            ${isLocked
                ? "bg-slate-900/50 border-2 border-slate-800/50 text-slate-600 grayscale"
                : `${gradientClass} border-2 border-white/10 text-white shadow-lg shadow-black/20 hover:scale-105 hover:rotate-2`
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
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [allAwards, userAwards] = await Promise.all([
                    awardService.getAll(token),
                    awardService.getUserAwards(targetUser.id, token)
                ]);

                // Map achieved IDs for easy lookup
                const achievedIds = new Set(userAwards.map(a => a.id));

                // Process awards into sections
                const processed = (allAwards || []).map(award => ({
                    ...award,
                    status: achievedIds.has(award.id) ? "achieved" : "locked",
                    icon: HeroIcons[award.iconName] || HeroIcons.QuestionMarkCircleIcon
                }));

                setAwards(processed);
            } catch (error) {
                console.error("Failed to fetch awards:", error);
                // Fallback to empty or previous mocked data if desired, but here we stay empty
            } finally {
                setLoading(false);
            }
        };

        if (targetUser?.id) {
            fetchData();
        }
    }, [targetUser?.id]);

    const categories = [
        { key: "irl", title: "IRL awards", color: "bg-yellow-500" },
        { key: "pin", title: "Pin awards", color: "bg-purple-500" },
        { key: "club", title: "Clubs awards", color: "bg-green-500" },
        { key: "special", title: "Young ESA awards", color: "bg-cyan-500" }
    ];

    if (loading) return <div className="py-10 text-center text-slate-500">Loading achievements...</div>;

    return (
        <div className="flex flex-col gap-12 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {categories.map((category) => {
                const categoryAwards = awards.filter(a => a.category === category.key);
                if (categoryAwards.length === 0) return null;

                return (
                    <div key={category.key} className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <div className={`w-1.5 h-6 ${category.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                            <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.2em]">{category.title}</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {categoryAwards.map((award) => (
                                <AwardTile key={award.id} award={award} />
                            ))}
                        </div>
                    </div>
                );
            })}

            {awards.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                    <HeroIcons.SparklesIcon className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 font-medium tracking-tight">No awards found. Check back later!</p>
                </div>
            )}
        </div>
    );
}
