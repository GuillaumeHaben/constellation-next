"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { userService } from "@/service/userService";
import { useAuth } from "@/context/AuthContext";
import { Spinner, Card, CardBody, Button } from "@heroui/react";
import { CheckCircleIcon, XCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MeetContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("");
    const [metUser, setMetUser] = useState(null);
    const hasValidated = useRef(false);

    useEffect(() => {
        const token = searchParams.get("t") || searchParams.get("token");
        const jwt = localStorage.getItem("token");

        if (!jwt) {
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            return;
        }

        if (!token) {
            setStatus("error");
            setMessage("Invalid meeting link. No token found.");
            return;
        }

        const validate = async () => {
            if (hasValidated.current) return;
            hasValidated.current = true;
            try {
                const result = await userService.validateEncounter(token, jwt);
                setStatus("success");
                setMessage(result.alreadyRecorded ? "Encounter already recorded previously. You're connected!" : "Encounter successfully recorded!");

                // Fetch details of the user met to redirect
                // The backend returns userLow/userHigh as either objects or raw IDs; handle both.
                const encounter = result?.encounter;
                let metUserId = result?.otherUserId ?? null;
                if (!metUserId && encounter) {
                    const userLowId = typeof encounter.userLow === 'object' && encounter.userLow !== null ? encounter.userLow.id : encounter.userLow;
                    const userHighId = typeof encounter.userHigh === 'object' && encounter.userHigh !== null ? encounter.userHigh.id : encounter.userHigh;

                    if (userLowId === user.id) metUserId = userHighId;
                    else if (userHighId === user.id) metUserId = userLowId;
                }

                const userData = metUserId ? await userService.getUserById(metUserId, jwt) : null;
                setMetUser(userData);

            } catch (error) {
                setStatus("error");
                setMessage(error.message || "Failed to validate encounter. The QR code might be expired.");
            }
        };

        if (user) {
            validate();
        }
    }, [searchParams, user, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <Card className="max-w-md w-full bg-slate-900 border-slate-800 shadow-2xl">
                <CardBody className="p-8 flex flex-col items-center text-center gap-6">
                    {status === "loading" && (
                        <>
                            <Spinner size="lg" color="primary" />
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Validating Connection</h2>
                                <p className="text-slate-400">Please wait while we confirm your IRL encounter...</p>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                                <CheckCircleIcon className="w-14 h-14 text-green-500 animate-in zoom-in duration-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                                <p className="text-slate-400">{message}</p>
                            </div>
                            <Button
                                color="primary"
                                onPress={() => metUser?.slug ? router.push(`/user/${metUser.slug}`) : router.push('/home')}
                                className="w-full font-semibold"
                            >
                                <UserIcon className="w-5 h-5 mr-2" />
                                View Profile
                            </Button>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
                                <XCircleIcon className="w-14 h-14 text-red-500 animate-in zoom-in duration-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
                                <p className="text-slate-400">{message}</p>
                            </div>
                            <Button
                                color="default"
                                variant="flat"
                                onPress={() => router.push('/home')}
                                className="w-full font-semibold text-white"
                            >
                                Go Back Home
                            </Button>
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export default function MeetPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-950">
            <NavBar />
            <main className="flex-1">
                <Suspense fallback={<div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>}>
                    <MeetContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
