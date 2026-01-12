import { Avatar, Chip, Tooltip, Button, Link, Badge } from "@heroui/react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { TeamsIcon } from "@/components/Icons";
import { getProfilePictureUrl } from "@/utils/media";
import { roleColorMap } from "../utils";

export function RenderCell({ user, columnKey, onRemove, canDelete }) {
    const cellValue = user[columnKey];

    const isOnline = user.lastSeenAt && (new Date() - new Date(user.lastSeenAt) < 300000); // 5 minutes

    switch (columnKey) {
        case "name":
            return (
                <Link href={`/user/${user.slug}`} className="no-underline text-default-700">
                    <div className="flex items-center gap-3">
                        <Badge
                            content=""
                            color="success"
                            shape="circle"
                            placement="bottom-right"
                            isInvisible={!isOnline}
                            className="bg-green-500 border-3 border-zinc-900 w-3 h-3"
                        >
                            <Avatar
                                radius="lg"
                                src={getProfilePictureUrl(user)}
                                size="md"
                            />
                        </Badge>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-small font-bold text-slate-200 truncate">
                                {`${user.firstName || ""} ${user.lastName || ""}`}
                            </span>
                            <span className="text-tiny text-slate-500 truncate">
                                {user.email}
                            </span>
                        </div>
                    </div>
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
                        <Button isIconOnly as="a" href={`https://teams.microsoft.com/l/chat/0/0?users=${user.email}`} target="_blank" size="sm" variant="light">
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
