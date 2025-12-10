"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { changelogService } from "@/service/changelogService";

export default function Changelog() {
    const { user, } = useAuth();
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChangelogs = async () => {
            console.log("Fetching changelogs...");
            const token = localStorage.getItem("token");
            try {
                const data = await changelogService.getAll(token);
                // Map API data to component format
                // Strapi v5 / client wrapper returns loose objects in array usually
                const mappedFeatures = data.map(item => ({
                    id: `v${item.version.replace(/\./g, '-')}`, // Create valid ID for scroll
                    version: item.version,
                    date: new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    title: item.title,
                    description: item.description,
                    tag: item.tag || 'Feature'
                }));
                setFeatures(mappedFeatures);
            } catch (error) {
                console.error("Failed to fetch changelogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChangelogs();
    }, []);

    if (!user) return null;

    const getTagStyle = (tag) => {
        if (tag === 'bug-fix') {
            return "bg-red-500/10 text-red-400 border-red-500/20";
        }
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    };

    return (
        <div className="min-h-screen flex flex-col scroll-smooth">
            <NavBar />

            <Header title={"Changelog"} breadcrumbs={<BreadCrumbs currentPage="Changelog" />} icon={ClockIcon} />

            <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Side Navigation - Sticky */}
                    <aside className="lg:w-1/4 hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <h3 className="text-xl font-semibold text-white/90 mb-4">Version History</h3>
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
                                    <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
                                </div>
                            ) : (
                                <nav className="flex flex-col space-y-2 border-l border-slate-700 pl-4">
                                    {features.map((feature) => (
                                        <a
                                            key={feature.id}
                                            href={`#${feature.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(feature.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="text-slate-400 hover:text-blue-400 transition-colors text-sm py-1 cursor-pointer"
                                        >
                                            v{feature.version} - {feature.date}
                                        </a>
                                    ))}
                                </nav>
                            )}
                        </div>
                    </aside>

                    {/* Timeline Content */}
                    <div className="lg:w-3/4">
                        {loading ? (
                            <div className="relative border-l border-slate-700 ml-3 lg:ml-0 space-y-12 pb-12">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative pl-8 lg:pl-12">
                                        <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-slate-700 ring-4 ring-slate-900" />
                                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-48 animate-pulse">
                                            <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4"></div>
                                            <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
                                            <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative border-l border-slate-700 ml-3 lg:ml-0 space-y-12 pb-12">
                                {features.map((feature) => (
                                    <div key={feature.id} id={feature.id} className="relative pl-8 lg:pl-12">
                                        {/* Timeline Bullet */}
                                        <div className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-slate-900 ${feature.tag === 'bug-fix' ? 'bg-red-500' : 'bg-blue-500'}`} />

                                        {/* Feature Card */}
                                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow hover:border-slate-600">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${getTagStyle(feature.tag)}`}>
                                                    {feature.tag}
                                                </span>
                                                <span className="text-slate-400 text-sm">
                                                    v{feature.version} • {feature.date}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {feature.title}
                                            </h3>

                                            <p className="text-slate-300 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}