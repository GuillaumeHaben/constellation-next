"use client";

import { useEffect, useState, use } from "react";
import { clubService } from "@/service/clubService";
import { TableUsers } from "@/components/TableUsers"; // Reused component
import BreadCrumbs from "@/components/BreadCrumbs";
import Header from "@/components/Header";
import NavBar from "@/components/Navbar";
import { Avatar, Badge, Spinner, Card, CardBody } from "@heroui/react";
import { getProfilePictureUrl } from "@/utils/media";
import { UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ClubDetailsPage({ params }) {
    const { documentId } = use(params);
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClub = async () => {
            if (!documentId) return;
            try {
                const token = localStorage.getItem("token");
                // Need to ensure owner is populated
                const data = await clubService.getById(documentId, token);
                // getById usually returns the single item.
                // Assuming getById uses findOne which supports populate in service
                // Use clubService.getById but we might need to ensure it populates owner.
                setClub(data.data || data); // Handle Strapi response
            } catch (err) {
                console.error("Failed to fetch club:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClub();
    }, [documentId]);

    // Custom fetch for club members
    // For now, we reuse getAll since we don't have a specific "getMembers" endpoint yet
    // filtering will be done client side if needed, or by the reused table if we passed a specific fetcher.
    // The user said "members list: the same table... later on we will simply filter".
    // So for now we just show TableUsers.

    // Breadcrumbs logic: "Constellation / Clubs / Name"
    // BreadCrumbs component likely takes items.

    if (loading) return <div className="w-full h-screen flex justify-center items-center"><Spinner size="lg" /></div>;
    if (!club) return <div className="text-center mt-10">Club not found</div>;

    const owner = club.owner;
    const isOnline = owner?.lastSeenAt && (new Date() - new Date(owner.lastSeenAt) < 300000);

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Header title={"Club Profile"} breadcrumbs={<BreadCrumbs currentPage={"club/" + club.name} />} icon={UserGroupIcon} />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Club Information */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex items-center space-x-2 px-2">
                                <UserGroupIcon className="w-5 h-5 text-blue-400" />
                                <h1 className="text-xl font-bold text-white">Club Information</h1>
                            </div>

                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden relative group">
                                {/* Decorative background effects */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500"></div>

                                <CardBody className="p-6 space-y-6 relative z-10">
                                    <div>
                                        <span className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-1 block">Name & purpose</span>
                                        <h1 className="text-xl font-bold text-white">{club.name}</h1>
                                        <p className="text-gray-400 text-sm leading-relaxed">{club.description}</p>
                                    </div>

                                    <div className="space-y-4 border-t border-white/5">

                                        {/* Creation Date */}
                                        <div>
                                            <span className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-1 block">Creation date</span>
                                            <p className="text-white font-medium">{new Date(club.creation).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
                                        </div>
                                        {/* Owner Display */}
                                        <div>
                                            <span className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">Owner</span>
                                            {owner ? (
                                                <Link href={`/user/${owner.slug}`} className="flex items-center gap-3 pt-1 rounded-lg">
                                                    <Badge
                                                        content=""
                                                        color="success"
                                                        shape="circle"
                                                        placement="bottom-right"
                                                        isInvisible={!isOnline}
                                                        className="bg-green-500 border-2 border-zinc-900"
                                                    >
                                                        <Avatar src={getProfilePictureUrl(owner)} size="md" />
                                                    </Badge>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{owner.firstName} {owner.lastName}</p>
                                                        <p className="text-xs text-gray-500">{owner.email}</p>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <span className="text-gray-500 italic">No owner assigned</span>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Right Column: Members */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center space-x-2 px-2">
                                <UsersIcon className="w-5 h-5 text-purple-400" />
                                <h1 className="text-xl font-bold text-white">Members</h1>
                            </div>

                            <TableUsers
                                users={owner ? [owner, ...(club.members || [])] : (club.members || [])}
                                initialVisibleColumns={["name", "esaSite", "position", "country", "directorate"]}
                            />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
