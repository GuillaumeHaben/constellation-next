import React from "react";
import { User, Chip, Tooltip, Button, Link } from "@heroui/react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { TeamsIcon } from "@/components/Icons";
import { getProfilePictureUrl } from "@/utils/media";
import { roleColorMap } from "../utils";

export function RenderCell({ user, columnKey, onRemove, canDelete }) {
    const cellValue = user[columnKey];

    switch (columnKey) {
        case "name":
            return (
                <Link href={`/user/${user.slug}`} className="no-underline text-default-700">
                    <User
                        avatarProps={{ radius: "lg", src: getProfilePictureUrl(user) }}
                        description={user.email}
                        name={`${user.firstName || ""} ${user.lastName || ""}`}
                    >
                        {user.email}
                    </User>
                </Link>
            );
        case "role":
            return (
                <div className="flex flex-col">
                    <Chip
                        className="capitalize"
                        color={roleColorMap[user.role?.name?.toLowerCase()] || "default"}
                        size="sm"
                        variant="flat"
                    >
                        {user.role?.name}
                    </Chip>
                </div>
            );
        case "actions":
            return (
                <div className="flex items-center justify-center gap-2">
                    <Tooltip content="View profile" placement="bottom">
                        <Button isIconOnly as="a" href={`/user/${user.slug}`} size="sm" variant="light">
                            <EyeIcon className="h-5 w-5 text-slate-400" />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Connect on Teams" placement="bottom">
                        <Button isIconOnly size="sm" variant="light">
                            <TeamsIcon className="h-5 w-5 text-indigo-600" />
                        </Button>
                    </Tooltip>
                    {onRemove && canDelete && (
                        <Tooltip content="Delete user" placement="bottom">
                            <Button isIconOnly onPress={() => {
                                if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                                    onRemove(user.id);
                                }
                            }} size="sm" variant="light">
                                <TrashIcon className="h-5 w-5 text-red-800" />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            );
        default:
            return cellValue;
    }
}
