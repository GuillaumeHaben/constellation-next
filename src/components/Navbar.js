"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton } from '@headlessui/react'
import { Bars3Icon, UserCircleIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import Image from "next/image";
import icon from '../../public/icon.png';

const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Clubs', href: '/clubs' },
    { name: 'MarketPins', href: '/marketPins' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    if (!user) return null;

    const normalize = (path) => path.replace(/\/$/, '');
    const navWithCurrent = navigation.map(item => ({
        ...item,
        current: normalize(pathname) === normalize(item.href)
    }));

    return (
        <Disclosure as="nav" className="bg-gray-800/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <Link href="/">
                                <Image
                                    alt="Constellation"
                                    src={icon}
                                    className="size-10"
                                    width={32}
                                    height={32}
                                />
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navWithCurrent.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current
                                                ? 'bg-gray-950/50 text-white'
                                                : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">

                            <Menu as="div" className="relative ml-3">
                                <MenuButton className="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <UserCircleIcon aria-hidden="true" className="size-10 rounded-full" />
                                </MenuButton>
                            </Menu>

                            <Menu as="div" className="relative ml-3">
                                <MenuButton className="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <Cog6ToothIcon aria-hidden="true" className="size-10 rounded-full" />
                                </MenuButton>
                            </Menu>

                            <div className="ml-4 flex items-center md:ml-6">
                                <a href="" onClick={logout} className="text-sm/6 font-semibold text-white outline-2 -outline-offset-1 outline-white/10 hover:outline-2 hover:-outline-offset-2 hover:outline-indigo-500 px-3 py-2 rounded-md">
                                    Sign out <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="md:hidden">
                <div className="border-t border-white/10 pt-4 pb-3 space-y-4">
                    <button type="button" className="flex items-center pb-3 pt-3 px-5 w-full text-left rounded-md cursor-pointer group bg-transparent hover:bg-white/5">
                        <div className="shrink-0">
                            <UserCircleIcon aria-hidden="true" className="size-12 rounded-full text-gray-400 group-hover:text-white transition-colors duration-200" />
                        </div>
                        <div className="ml-3">
                            <div className="text-base/5 font-medium text-gray-400 group-hover:text-white transition-colors duration-200">{"John Doe"}</div>
                            <div className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-200">{user.email}</div>
                        </div>
                    </button>
                    <button type="button" className="flex items-center pb-3 pt-3 px-5 w-full text-left rounded-md cursor-pointer group bg-transparent hover:bg-white/5">
                        <div className="shrink-0">
                            <Cog6ToothIcon aria-hidden="true" className="size-12 rounded-full text-gray-400 group-hover:text-white transition-colors duration-200" />
                        </div>
                        <div className="ml-3">
                            <div className="text-base/5 font-medium text-gray-400 group-hover:text-white transition-colors duration-200">Settings</div>
                        </div>
                    </button>
                    <button type="button" className="flex items-center pb-6 pt-6 px-7 w-full text-left hover:bg-white/5 rounded-md cursor-pointer">
                        <Link href="" onClick={logout} className="text-base/5 font-medium text-white">
                            Sign out <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </button>
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}
