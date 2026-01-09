"use client";

import { useAuth } from "@/context/AuthContext";
import BreadCrumbs from "@/components/BreadCrumbs";
import NavBar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Quote from "@/components/Quote";
import HeatMap from "./HeatMap";
import { MapIcon } from "@heroicons/react/24/outline";

export default function Map() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <Header title={"Map"} breadcrumbs={<BreadCrumbs currentPage="Map" />} icon={MapIcon} />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 bg-slate-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                Location Insights
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Sharing roughly where you live now</h2>
                            <p className="text-base text-gray-400 leading-relaxed max-w-3xl">
                                This helps newcomers find the best housing areas near ESA sites.</p>
                            <p className="text-base text-gray-400 leading-relaxed max-w-3xl">
                                Your exact address is stored securely and only visible from your profile page. Only the generalized density is shown here.
                            </p>
                        </div>

                        <div className="lg:border-l lg:border-white/5 lg:pl-8 flex flex-col justify-center">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center lg:text-left">Activity Density</h3>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                                {[
                                    { label: '1', icon: '🔵' },
                                    { label: '~3', icon: '🟢' },
                                    { label: '~8', icon: '🟡' },
                                    { label: '~15', icon: '🟠' },
                                    { label: '25+', icon: '🔴' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                                        <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                                        <span className="text-xs font-bold text-gray-300">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                        <HeatMap />
                    </div>

                    <div className="pt-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-white tracking-tight">Future Iterations</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                            <div className="relative group overflow-hidden bg-slate-900/40 rounded-3xl border border-white/5 p-8 transition-all hover:border-blue-500/20">
                                <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Coming Soon</div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">🎓</div>
                                    <h3 className="text-lg font-bold text-white">Alumni Network</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Wondering where our star colleagues went after ESA? We're building a global map to stay in touch with our alumni network across the space industry and beyond.
                                    </p>
                                </div>
                            </div>

                            <div className="relative group overflow-hidden bg-slate-900/40 rounded-3xl border border-white/5 p-8 transition-all hover:border-purple-500/20">
                                <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Coming Soon</div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">🌍</div>
                                    <h3 className="text-lg font-bold text-white">Heritage & Hometowns</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Ever encoutered someone from your hometown while working at ESA? Soon, you'll be able to see a map of where everyone is originally from, encouraging to reach out to your fellows.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}