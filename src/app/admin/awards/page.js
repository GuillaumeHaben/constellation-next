"use client";

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BreadCrumbs from "@/components/BreadCrumbs";
import Footer from "@/components/Footer";
import { TrophyIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody } from "@heroui/react";

export default function AdminAwardsPage() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Header
                title="Award Management"
                breadcrumbs={<BreadCrumbs currentPage="Award Management" />}
                icon={TrophyIcon}
            />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
                    {/* Placeholder for Management Controls */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-200">System Awards</h2>
                            <p className="text-sm text-slate-400">Configure and manage badges given to the crew.</p>
                        </div>
                        <Button
                            color="primary"
                            variant="shadow"
                            startContent={<PlusIcon className="w-5 h-5" />}
                            isDisabled
                        >
                            Create Award
                        </Button>
                    </div>

                    {/* Placeholder for Award Grid */}
                    <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm border-dashed border-2">
                        <CardBody className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-slate-800 text-slate-600">
                                <TrophyIcon className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-300">Management UI Coming Soon</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    Admins will soon be able to add, update, and delete awards from this panel.
                                    The automated assignment engine is currently being prepared in the background.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Developer Note */}
                    <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2 text-sm italic">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Implementation Note
                        </h4>
                        <p className="text-xs text-blue-400/80 leading-relaxed">
                            The `Award` collection type needs to be initialized in Strapi with the following attributes:
                            `name`, `requirement`, `category`, `iconName`, `bgGradient`, `isDynamic`, `dynamicType`, `threshold`, and a Many-to-Many relation with `Users`.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
