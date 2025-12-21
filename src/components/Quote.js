"use client";

import Image from "next/image";

export default function Quote({ text, author, authorTitle, picture }) {
    return (
        <div className="hidden md:block bg-slate-800/10 border border-slate-700/20 rounded-2xl p-6 shadow-inner backdrop-blur-sm group" >
            <figure className="max-w-screen-lg mx-auto flex items-center justify-center gap-8">
                <blockquote className="max-w-xl">
                    <p className="text-base italic font-medium tracking-tight text-slate-500 group-hover:text-slate-200 leading-relaxed text-right transition-colors duration-500">
                        {text}
                    </p>
                </blockquote>

                {/* Vertical Separator */}
                <div className="h-10 w-[1px] bg-slate-700/50 group-hover:bg-blue-500/30 transition-colors duration-500" />

                <figcaption className="flex items-center space-x-3 rtl:space-x-reverse min-w-max">
                    <div className="relative">
                        <Image
                            className="w-11 h-11 rounded-full border-2 border-slate-700/50 group-hover:border-blue-500/40 transition-all duration-500 shadow-xl object-cover grayscale group-hover:grayscale-0"
                            src={picture}
                            alt={author}
                            width={44}
                            height={44}
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <cite className="font-bold text-slate-200 not-italic text-sm tracking-tight transition-colors duration-300 group-hover:text-blue-100">{author}</cite>
                        <cite className="text-[10px] text-slate-500 font-bold uppercase tracking-widest not-italic opacity-80">{authorTitle}</cite>
                    </div>
                </figcaption>
            </figure>
        </div >
    )
}