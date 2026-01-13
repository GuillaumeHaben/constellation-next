"use client";

import NavBar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadCrumbs from "@/components/BreadCrumbs";
import { InformationCircleIcon, RocketLaunchIcon, HeartIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@heroui/react";
import Link from "next/link";

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
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

                    {/* Vision Section */}
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tight">Our Mission</h2>
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
                            <CodeBracketIcon className="w-12 h-12 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white px-4">The Founder's Vision</h2>
                        <div className="text-justify italic">
                            <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed pb-2">
                                Constellation is, first and foremost, about us — each individual who makes up the ESA community. I often think of it as a small city: we share many things, such as common passions, hobbies, technical expertise, and countries of origin, yet, for the most part, it feels like we do not know each other very well. I am convinced that we would all benefit from being more aware of one another — our initiatives and our interests. Who knows? Someone else might be working on the same technologies, come from the same hometown, or speak the same language. I want to give people the keys to get to know each other better, to receive greater recognition for our engagement, and simply to feel proud of belonging to such a remarkable workplace.</p>
                            <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed pb-2">
                                I want Constellation to be user-friendly, which is why I place the greatest emphasis on design and performance — in my view, the key pillars for securing early adopters. I also hope that Constellation will continue beyond the end of my contract. For this reason, I dedicate a significant amount of time to documentation, testing, and long-term maintainability.
                            </p>
                            <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed pb-2">
                                Through this project, I also wanted to demonstrate that it is possible to make things happen at ESA. Despite procedures that can sometimes feel slow and heavy, Constellation proves that we can still find ways to create something meaningful — even when it is done entirely in our free time as a side project. Of course, as a researcher in product assurance, I fully understand the importance of assessments and compliance processes. It is ultimately about finding the right balance: knowing how to kick-start an initiative before moving into full certification.
                            </p>
                            <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed pb-2">
                                I truly believe that everyone can contribute to this project, and I very much look forward to it — so please reach out! It is not only about coding: it is also about branding, promotion, testing, brainstorming, or simply sharing feedback, both good and bad. Each of us knows something better than the next. What are you the best at?
                            </p>
                            <p className="text-white max-w-2xl mx-auto text-sm leading-relaxed text-right pt-6">
                                <Link href="/user/guillaume-haben/" >
                                    Guillaume Haben
                                </Link>
                            </p>
                        </div>
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
