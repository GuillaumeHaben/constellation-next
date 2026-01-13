"use client";

import { useState, useEffect } from "react";
import { Avatar, Button, Chip } from "@heroui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { pinService } from "@/service/pinService";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BreadCrumbs from "@/components/BreadCrumbs";
import Footer from "@/components/Footer";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function AdminApprovalsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [pendingPins, setPendingPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null); // ID of pin being processed

    useEffect(() => {
        if (user) {
            // Access control
            const role = user.role?.type;
            if (role !== 'admin') {
                router.push('/');
                return;
            }
            fetchPending();
        } else if (user === null && !loading) {
            // Assuming AuthContext sets user to null if not logged in
            router.push('/login');
        }
    }, [user, router, loading]);

    const fetchPending = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await pinService.getPendingPins(token);
            setPendingPins(data || []);
        } catch (error) {
            console.error("Failed to fetch pending pins", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (pin) => {
        setProcessing(pin.id);
        const pinIdentifier = pin.documentId || pin.id;
        try {
            const token = localStorage.getItem("token");
            await pinService.approve(pinIdentifier, token);
            setPendingPins(prev => prev.filter(p => (p.documentId || p.id) !== pinIdentifier));
        } catch (error) {
            console.error("Failed to approve", error);
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (pin) => {
        setProcessing(pin.id);
        const pinIdentifier = pin.documentId || pin.id;
        try {
            const token = localStorage.getItem("token");
            await pinService.delete(pinIdentifier, token);
            setPendingPins(prev => prev.filter(p => (p.documentId || p.id) !== pinIdentifier));
        } catch (error) {
            console.error("Failed to reject", error);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Header
                title="Pin Approval"
                breadcrumbs={<BreadCrumbs currentPage="Pin Approval" />}
                icon={CheckBadgeIcon}
            />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
                    {pendingPins.length === 0 ? (
                        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
                            <p className="text-gray-400">No pending pin suggestions.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingPins.map((pin) => (
                                <div key={pin.id} className="bg-gray-800 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-700">
                                    {/* Image Preview */}
                                    <div className="shrink-0">
                                        <Avatar
                                            src={pin.image?.url
                                                ? (pin.image.url.startsWith("http") ? pin.image.url : `${process.env.NEXT_PUBLIC_API_URL}${pin.image.url}`)
                                                : null}
                                            className="w-24 h-24"
                                            isBordered
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-xl font-semibold">{pin.name}</h3>
                                        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                            <Chip size="sm" variant="flat">Status: {pin.status}</Chip>
                                            {pin.suggestedBy && (
                                                <Chip size="sm" variant="dot" color="primary">
                                                    By: {pin.suggestedBy.username || pin.suggestedBy.email}
                                                </Chip>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button
                                            color="success"
                                            variant="flat"
                                            startContent={<CheckIcon className="w-5 h-5" />}
                                            isLoading={processing === pin.id}
                                            onPress={() => handleApprove(pin)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            color="danger"
                                            variant="flat"
                                            startContent={<XMarkIcon className="w-5 h-5" />}
                                            isLoading={processing === pin.id}
                                            onPress={() => handleReject(pin)}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
