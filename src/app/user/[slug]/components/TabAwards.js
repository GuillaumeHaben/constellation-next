"use client";

import {
    Card,
    CardBody
} from "@heroui/react";

export default function TabAwards({ targetUser }) {
    return (
        <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow hover:border-slate-600 mt-4">
            <CardBody className="p-6">
                <div className="text-center text-gray-400 py-8">
                    Awards list coming soon...
                </div>
            </CardBody>
        </Card>
    );
}
