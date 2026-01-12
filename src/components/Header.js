"use client";

import { useEffect } from "react";
import Quote from "./Quote";

export default function Header({ title, breadcrumbs, icon }) {
    const Icon = icon;

    useEffect(() => {
        document.title = `Constellation - ${title}`;
    }, [title]);

    return (
        <header
            className="mb-6 relative bg-gradient-to-r from-blue-950 to-blue-600 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10"
        >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-8 w-8 text-white" />}
                        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                    </div>
                    {breadcrumbs}
                </div>
                {
                    title === "Home" && (
                        <Quote text="We are all of us stars, and we deserve to twinkle" author="Marilyn Monroe" authorTitle="Hollywood Icon" picture="/img/marilyn-monroe.jpg" />
                    ) ||
                    title === "Changelog" && (
                        <Quote text="One small step for man, one giant leap for mankind" author="Neil Armstrong" authorTitle="Humankind Ambassador" picture="/img/neil-armstrong.jpg" />
                    ) ||
                    title === "Feedback" && (
                        <Quote text="Be the change you want to see in the world" author="Mahatma Gandhi" authorTitle="Defender of Freedom" picture="/img/mahatma-gandhi.jpg" />
                    ) ||
                    title === "Profile" && (
                        <Quote text="Life is beautiful not because of the things we see or the things we do. Life is beautiful because of the people we meet" author="Simon Sinek" authorTitle="Inspirational Speaker" picture="/img/simon-sinek.jpg" />
                    ) ||
                    title === "Map" && (
                        <Quote text="I wisely started with a map, and made the story fit" author="J.R.R. Tolkien" authorTitle="Writer, poet & philologist" picture="/img/jrr-tolkien.jpg" />
                    )
                    // title === "Users" && (
                    //     <Quote text="Whatever the future holds, the bond and the friendship between our people are unbreakable" author="Ursula von der Leyen" authorTitle="European Leading Figure" picture="/img/ursula-von-der-leyen.jpg" />
                    // )
                }
            </div>

        </header>
    );
}
