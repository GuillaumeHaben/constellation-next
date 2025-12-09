"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClockIcon } from "@heroicons/react/24/outline";

// Temporary raw data as requested
const features = [
    {
        id: "v1-2-1",
        version: "1.2.1",
        date: "June 2024",
        title: "Login Session Fix",
        description: "Fixed an issue where users were being logged out unexpectedly after refreshing the page.",
        tag: "Bug Fix"
    },
    {
        id: "v1-2-0",
        version: "1.2.0",
        date: "June 2024",
        title: "About Dropdown & Notification System",
        description: "Introduced a new 'About' dropdown menu in the navigation bar and a notification system to alert users of new updates.",
        tag: "Feature"
    },
    {
        id: "v1-1-5",
        version: "1.1.5",
        date: "May 2024",
        title: "Profile Picture Upload",
        description: "Users can now upload and update their profile pictures directly from the settings page.",
        tag: "Feature"
    },
    {
        id: "v1-1-0",
        version: "1.1.0",
        date: "April 2024",
        title: "Dark Mode Support",
        description: "Full system-wide dark mode support has been added. The theme respects system preferences by default.",
        tag: "Feature"
    },
    {
        id: "v1-0-2",
        version: "1.0.2",
        date: "March 2024",
        title: "Performance Improvements",
        description: "Optimized database queries for the user dashboard, resulting in a 50% reduction in load times.",
        tag: "Feature"
    },
    {
        id: "v1-0-0",
        version: "1.0.0",
        date: "January 2024",
        title: "Initial Launch",
        description: "The first public release of Constellation! Includes basic user management, authentication, and project tracking.",
        tag: "Feature"
    }
];

export default function Changelog() {
    const { user } = useAuth();
    if (!user) return null;

    const getTagStyle = (tag) => {
        if (tag === 'Bug Fix') {
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
                        </div>
                    </aside>

                    {/* Timeline Content */}
                    <div className="lg:w-3/4">
                        <div className="relative border-l border-slate-700 ml-3 lg:ml-0 space-y-12 pb-12">
                            {features.map((feature) => (
                                <div key={feature.id} id={feature.id} className="relative pl-8 lg:pl-12">
                                    {/* Timeline Bullet */}
                                    <div className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-slate-900 ${feature.tag === 'Bug Fix' ? 'bg-red-500' : 'bg-blue-500'}`} />

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
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}