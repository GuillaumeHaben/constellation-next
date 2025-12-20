"use client";

import {
    Card,
    CardBody,
    Tabs,
    Tab
} from "@heroui/react";
import { UserIcon, TrophyIcon, EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import TabOverview from "./TabOverview";
import TabPins from "./TabPins";
import TabAwards from "./TabAwards";

export default function MainContent({ targetUser }) {
    return (
        <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow hover:border-slate-600 h-full">
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
                        <div className="pt-6">
                            <TabOverview targetUser={targetUser} />
                        </div>
                    </Tab>
                    <Tab
                        key="pins"
                        title={
                            <div className="flex items-center space-x-2">
                                <EllipsisHorizontalCircleIcon className="w-5 h-5" />
                                <span>Pins</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <TabPins targetUser={targetUser} />
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
