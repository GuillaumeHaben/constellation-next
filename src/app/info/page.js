"use client";

import NavBar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadCrumbs from "@/components/BreadCrumbs";
import { InformationCircleIcon, RocketLaunchIcon, HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@heroui/react";

export default function InfoPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Header
                title="Info"
                breadcrumbs={<BreadCrumbs currentPage="info" />}
                icon={InformationCircleIcon}
            />

            <main className="flex-1">
                <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">

                    {/* Vision Section */}
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tight">Our Mission</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Constellation is more than a platform. It's a digital space designed to connect
                            the next generation of space pioneers at the European Space Agency.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-slate-800/20 border-slate-700/30 backdrop-blur-md">
                            <CardBody className="p-8 flex flex-col items-center text-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30">
                                    <UsersIcon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Connect</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Discover peers across all ESA sites. Break the silos and find colleagues
                                    sharing your passions and professional interests.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="bg-slate-800/20 border-slate-700/30 backdrop-blur-md">
                            <CardBody className="p-8 flex flex-col items-center text-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
                                    <RocketLaunchIcon className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Share</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Showcase your initiatives and projects. Build pride in what you do
                                    and inspire others in the YP community.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="bg-slate-800/20 border-slate-700/30 backdrop-blur-md">
                            <CardBody className="p-8 flex flex-col items-center text-center gap-4">
                                <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30">
                                    <HeartIcon className="w-8 h-8 text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Belong</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Build a lasting community. Constellation helps you create connections
                                    that endure beyond your mission or rotation.
                                </p>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Team / ESA Section */}
                    <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-3xl p-8 md:p-12 border border-blue-500/20 text-center space-y-6">
                        <div className="flex justify-center">
                            <UserGroupIcon className="w-12 h-12 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white px-4">Built by YPs, for YPs</h2>
                        <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
                            Constellation was born from a simple observation: our agency is full of brilliant individuals,
                            yet crossing orbits isn't always easy. We built this tool to make our galaxy a bit smaller
                            and our community a lot stronger.
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

// Internal icon helper since users icon is needed
function UsersIcon({ className }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
    );
}
