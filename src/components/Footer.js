"use client";

import { Parisienne } from "next/font/google";
import Image from "next/image";
import esaLogo from '../../public/esa-logo-white.png';

const parisienne = Parisienne({
    weight: '400',
    subsets: ["latin"],
});

export default function Footer() {

    return (
        <footer className="w-full bg-gradient-to-r from-slate-950 to-slate-800 py-6 border-t border-gray-700 mt-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-5">
                <div>
                    <a className={parisienne.className + " text-2xl font-semibold tracking-tight text-balance text-white sm:text-2xl"} href="/" aria-label="Brand">Constellation</a>
                </div>

                {/* <ul className="text-center">
                    <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600">
                        <a className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">
                            About
                        </a>
                    </li>
                    <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600">
                        <a className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">
                            Terms of Service
                        </a>
                    </li>
                    <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600">
                        <a className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">
                            How to get involved
                        </a>
                    </li>
                </ul> */}

                {/* <div className="md:text-end space-x-2"> */}
                <div className="text-center">
                    <p className="text-xs text-slate-100">Made at &nbsp;🌙&nbsp; with &nbsp;♥️&nbsp; for our beloved&nbsp;
                        <span className="inline-flex items-center align-middle pr-[-10px]">
                            <Image
                                alt="ESA logo"
                                src={esaLogo}
                                width={64}
                                height={64}
                                className="inline-block h-4 mb-[1px]  w-auto align-middle"
                            />
                        </span> community</p>
                </div>

                <div className="md:text-end space-x-2">
                    <p className="text-xs text-slate-100">©{new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    )
}