"use client";

import NavBar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Quote from "@/components/Quote";
import BreadCrumbs from "@/components/BreadCrumbs";
import { ChatBubbleBottomCenterTextIcon, EnvelopeIcon, BugAntIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Button } from "@heroui/react";

export default function FeedbackPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Header
                title="Feedback"
                breadcrumbs={<BreadCrumbs currentPage="feedback" />}
                icon={ChatBubbleBottomCenterTextIcon}
            />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-6">
                        <h2 className="text-4xl font-black text-white tracking-tight">Help us grow the Galaxy</h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed text-center">
                            Constellation is a living project. Your feedback is the fuel moving our mission forward.
                            Found a bug? Have a stellar idea? We want to hear it.
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="bg-slate-800/20 border-slate-700/30 backdrop-blur-md overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                            <CardBody className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 p-8 bg-blue-600/10 flex flex-col items-center justify-center gap-4 text-center border-b md:border-b-0 md:border-r border-slate-700/30">
                                        <div className="p-4 rounded-full bg-blue-500/20">
                                            <EnvelopeIcon className="w-10 h-10 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">Email Us</p>
                                            <p className="text-slate-500 text-xs">Direct feedback loop</p>
                                        </div>
                                    </div>
                                    <div className="md:w-2/3 p-8 space-y-4">
                                        <h3 className="text-xl font-bold text-white">Share your thoughts directly</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            The most direct way to reach the team is via email. We read every message and
                                            respond to every idea. Whether it&apos;s a small tweak or a major vision, let&apos;s talk.
                                        </p>
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-900/40"
                                            as="a"
                                            href="mailto:guillaume.haben@esa.int?subject=[Constellation] Feedback"
                                        >
                                            Send Email
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-800/10 border-slate-700/20 hover:bg-slate-800/20 transition-all">
                                <CardBody className="p-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <BugAntIcon className="w-6 h-6 text-rose-400" />
                                        <h4 className="text-white font-bold">Report a bug</h4>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        If something isn&apos;t working as expected, let us know under the hood.
                                        Every fix makes the galaxy safer for everyone.
                                    </p>
                                </CardBody>
                            </Card>

                            <Card className="bg-slate-800/10 border-slate-700/20 hover:bg-slate-800/20 transition-all">
                                <CardBody className="p-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <LightBulbIcon className="w-6 h-6 text-amber-400" />
                                        <h4 className="text-white font-bold">Request Feature</h4>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        Dreaming of a new way to connect? Tell us what feature would make
                                        Constellation indispensable for your daily life at ESA.
                                    </p>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
