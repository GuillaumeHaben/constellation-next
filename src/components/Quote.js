"use client";

import Image from "next/image";

export default function Quote({ text, author, authorTitle, picture }) {
    return (
        <div className="hidden lg:block backdrop-blur-sm group align-right" >
            <figure className="max-w-screen-lg mx-auto flex items-center justify-end gap-8">
                <blockquote className="max-w-xl w-1/2">
                    <p className="text-base italic font-medium tracking-tight text-slate-300 group-hover:text-slate-200 leading-relaxed text-right transition-colors duration-500">
                        &quot;{text}&quot;
                    </p>
                </blockquote>

                <div className="flex items-center gap-4 border-l-1 border-slate-300 group-hover:border-slate-200 pl-8 transition-all duration-500">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-slate-400 group-hover:ring-slate-200 transition-all duration-500">
                        <Image
                            src={picture}
                            alt={author}
                            fill
                            unoptimized
                            className="object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-130 transition-all duration-700"
                        />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors duration-500">
                            {author}
                        </div>
                        <div className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors duration-500 uppercase tracking-widest">
                            {authorTitle}
                        </div>
                    </div>
                </div>
            </figure>
        </div>
    );
}