import React from "react";
import { Progress } from "@heroui/react";

export default function ProgressBar({ targetUser }) {

    const keysToCheck = ["address", "birthday", "country", "email", "phoneNumber", "directorate", "position", "instagram", "website", "linkedin", "facebook", "github", "twitter", "esaSite", "firstName", "lastName", "profilePicture"];

    const countNotNull = keysToCheck.filter(key => targetUser[key] != null).length;

    const completionPercentage = countNotNull / keysToCheck.length * 100;
    return (
        <Progress
            classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-linear-to-r from-blue-500 to-pink-500",
                label: "tracking-wider font-medium text-gray-500",
                value: "text-gray-500",
            }}
            label="Profile completion"
            radius="sm"
            showValueLabel={true}
            size="sm"
            value={completionPercentage}
        />
    );
}

