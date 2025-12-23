"use client";

import {
    Card,
    CardBody,
    Tabs,
    Tab
} from "@heroui/react";
import { UserIcon, TrophyIcon, SparklesIcon, ChatBubbleLeftRightIcon, UsersIcon } from "@heroicons/react/24/outline";
import TabOverview from "./TabOverview";
import TabPins from "./TabPins";
import TabAwards from "./TabAwards";
import TabSocial from "./TabSocial";
import TabQR from "./TabIRL";

export default function MainContent({ targetUser }) {
    return (
        <Card className="bg-gradient-to-br p-6 from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl transition-all duration-300 hover:border-slate-600 h-full relative overflow-hidden group">
            {/* Decorative background effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/10 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none group-hover:bg-purple-500/10 transition-all duration-500"></div>
            <CardBody className="p-0">
                <Tabs aria-label="Profile Tabs" color="primary" variant="underlined" classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-primary"
                }}>
                    <Tab
                        key="overview"
                        title={
                            <div className="flex items-center space-x-2">
                                <UserIcon className="w-5 h-5" />
                                <span>Overview</span>
                            </div>
                        }
                    >
                        <div className="pt-2">
                            <TabOverview targetUser={targetUser} />
                        </div>
                    </Tab>
                    <Tab
                        key="social"
                        title={
                            <div className="flex items-center space-x-2">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                <span>Social</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <TabSocial targetUser={targetUser} />
                        </div>
                    </Tab>
                    <Tab
                        key="pins"
                        title={
                            <div className="flex items-center space-x-2">
                                <SparklesIcon className="w-5 h-5" />
                                <span>Pins</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <TabPins targetUser={targetUser} />
                        </div>
                    </Tab>
                    <Tab
                        key="qr"
                        title={
                            <div className="flex items-center space-x-2">
                                <UsersIcon className="w-5 h-5" />
                                <span>IRL</span>
                            </div>
                        }
                    >
                        <div className="pt-3">
                            <TabQR targetUser={targetUser} />
                        </div>
                    </Tab>
                    <Tab
                        key="awards"
                        title={
                            <div className="flex items-center space-x-2">
                                <TrophyIcon className="w-5 h-5" />
                                <span>Awards</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <TabAwards targetUser={targetUser} />
                        </div>
                    </Tab>
                </Tabs>
            </CardBody>
        </Card>
    );
}
