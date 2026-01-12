import { Avatar, Tooltip, Button, Link, Badge } from "@heroui/react";
import { PencilSquareIcon, TrashIcon, EyeIcon, UserPlusIcon, UserMinusIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { getProfilePictureUrl } from "@/utils/media";

export function RenderCell({ club, columnKey, onEdit, onRemove, onJoin, onLeave, canEdit, canDelete, currentUser }) {
    const cellValue = club[columnKey];

    switch (columnKey) {
        case "name":
            return (
                <div className="flex flex-col">
                    <Link href={`/club/${club.documentId}`} className="text-small capitalize text-foreground no-underline font-bold text-slate-200 truncate">
                        {club.name}
                    </Link>
                </div>
            );
        case "owner":
            const owner = club.owner;
            if (!owner) return <span className="text-default-400">Unknown</span>;

            const isOnline = owner.lastSeenAt && (new Date() - new Date(owner.lastSeenAt) < 300000); // 5 minutes

            return (
                <Link href={`/user/${owner.slug}`} className="no-underline text-default-700">
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
                                src={getProfilePictureUrl(owner)}
                                size="md"
                            />
                        </Badge>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-small font-bold text-slate-200 truncate">
                                {`${owner.firstName || ""} ${owner.lastName || ""}`}
                            </span>
                            <span className="text-tiny text-slate-500 truncate">
                                {owner.email}
                            </span>
                        </div>
                    </div>
                </Link>
            );
        case "creation":
            return (
                <div className="flex flex-col">
                    <span className="text-small text-default-400">
                        {new Date(club.creation).toLocaleDateString()}
                    </span>
                </div>
            );
        case "members":
            const memberCount = (club.members?.length || 0) + (club.owner ? 1 : 0);
            return (
                <div className="flex items-center gap-1 text-sm text-slate-400">
                    <UserGroupIcon className="h-4 w-4" />
                    <span className="font-medium">{memberCount}</span>
                </div>
            );
        case "actions":
            const isOwner = club.owner?.documentId === currentUser?.documentId;
            const isMember = club.members?.some(m => m.documentId === currentUser?.documentId);

            return (
                <div className="flex items-center justify-center gap-2">
                    <Tooltip content="View club" placement="bottom">
                        <Button isIconOnly as="a" href={`/club/${club.documentId}`} size="sm" variant="light">
                            <EyeIcon className="h-5 w-5 text-slate-400" />
                        </Button>
                    </Tooltip>

                    {!isOwner && !isMember && (
                        <Tooltip content="Join club" placement="bottom">
                            <Button isIconOnly onPress={() => onJoin(club.documentId)} size="sm" variant="light">
                                <UserPlusIcon className="h-5 w-5 text-green-500" />
                            </Button>
                        </Tooltip>
                    )}

                    {!isOwner && isMember && (
                        <Tooltip content="Leave club" placement="bottom">
                            <Button isIconOnly onPress={() => onLeave(club.documentId)} size="sm" variant="light">
                                <UserMinusIcon className="h-5 w-5 text-orange-500" />
                            </Button>
                        </Tooltip>
                    )}

                    {canEdit && (
                        <Tooltip content="Edit club" placement="bottom">
                            <Button
                                isIconOnly
                                onPress={() => onEdit(club)}
                                size="sm"
                                variant="light"
                            >
                                <PencilSquareIcon className="h-5 w-5 text-yellow-500" />
                            </Button>
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip content="Delete club" placement="bottom">
                            <Button
                                isIconOnly
                                onClick={() => onRemove(club.documentId)}
                                size="sm"
                                variant="light"
                            >
                                <TrashIcon className="h-5 w-5 text-red-500" />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            );
        default:
            return cellValue;
    }
}
