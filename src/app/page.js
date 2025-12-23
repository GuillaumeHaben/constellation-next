"use client";

import { useAuth } from "@/context/AuthContext";
import { Parisienne } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import esaLogo from '../../public/img/esa-logo-white.png';
import icon from '../../public/img/icon.png';
import Galaxy from "../components/Galaxy";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";


const parisienne = Parisienne({
  weight: '400',
  subsets: ["latin"],
});

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="mx-auto max-w-7xl flex items-center justify-between p-4 sm:p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Constellation</span>
              <Image
                alt="Constellation"
                src={icon}
                width={32}
                height={32}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="flex flex-1 justify-end" data-mobile-actions>
            {user ? (
              <div className="flex gap-3">
                <Link href="/home" className="flex items-center gap-2 text-sm/6 font-semibold text-white outline-2 -outline-offset-1 outline-white/10 hover:outline-2 hover:-outline-offset-2 hover:outline-blue-500 px-3 py-2 rounded-md">
                  {HomeIcon && <HomeIcon className="h-6 w-6 text-white" />} Home <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex items-center gap-2 text-sm/6 font-semibold text-white outline-2 -outline-offset-1 outline-white/10 hover:outline-2 hover:-outline-offset-2 hover:outline-blue-500 px-3 py-2 rounded-md">
                  Log in <span aria-hidden="true">{ArrowRightEndOnRectangleIcon && <ArrowRightEndOnRectangleIcon className="h-6 w-6 text-white" />}</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="relative isolate flex w-full flex-1 flex-col items-center justify-center gap-10 px-6 text-center lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
        <div className="mx-auto max-w-2xl space-y-10">
          <div className="hidden sm:flex justify-center">
            <div className="relative rounded-full px-4 py-1 text-sm/6 text-gray-300 ring-1 ring-white/10 hover:ring-white/20 whitespace-nowrap">
              Something exciting is about to happen at {" "}
              <span className="inline-flex items-center align-middle">
                <Image
                  alt="ESA logo"
                  src={esaLogo}
                  width={256}
                  height={256}
                  className="inline-block h-6 w-auto align-middle"
                />
              </span>
            </div>
          </div>
          <div className="space-y-8">
            <h1 className={parisienne.className + " text-5xl font-semibold tracking-tight text-balance text-white sm:text-9xl"}>
              Constellation
            </h1>
            <p className="text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              Connecting all the ⭐ together
            </p>
            <div className="flex items-center justify-center gap-x-6">
              <Link
                target="_blank"
                href="https://docs.google.com/document/d/1cWwAar7skvMQOlLjMmb8TLNhKaZcticAWuBFdh-cb9g/edit?usp=drive_link"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </main>
      <Galaxy />
    </div>
  )
}
