"use client";

export default function Header({ title, breadcrumbs }) {

    return (
        <header className="mb-6 relative bg-gradient-to-r from-blue-950 to-blue-600 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                {breadcrumbs}
            </div>
        </header>
    )
}
