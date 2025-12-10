"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton } from '@headlessui/react'
import {
    Bars3Icon,
    ArrowLeftEndOnRectangleIcon,
    XMarkIcon,
    Cog6ToothIcon,
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    MapIcon,
    ShoppingBagIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";
import Image from "next/image";
import icon from '../../public/img/icon.png';
import { Avatar } from "@heroui/react";
import { getProfilePictureUrl } from "@/utils/media";

const navigation = [
    { name: 'Home', href: '/home', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Clubs', href: '/clubs', icon: UserGroupIcon },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'MarketPins', href: '/marketPins', icon: ShoppingBagIcon },
    { name: 'Changelog', href: '/changelog', icon: ClockIcon },
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
        <Disclosure as="nav" className="bg-gray-900 border-b">
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
                                {navWithCurrent.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-950/50 text-white'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2',
                                            )}
                                        >
                                            {Icon && <Icon className="h-5 w-5" />}
                                            {item.name}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">

                            <Menu as="div" className="relative ml-3">
                                <Link href={`/user/${user.slug}`} className="flex items-center gap-3">
                                    <MenuButton className="relative flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        <Avatar
                                            src={getProfilePictureUrl(user)}
                                            className="w-8 h-8 mr-1"
                                            isBordered
                                            radius="full"
                                            color="default"
                                        />
                                        <span className="text-sm font-medium text-white">
                                            {user.firstName} {user.lastName}
                                        </span>
                                    </MenuButton>
                                </Link>
                            </Menu>

                            <div className="ml-4 flex items-center md:ml-8">
                                <a href="" onClick={logout} className="flex items-center gap-2 text-sm/6 font-semibold text-white outline-2 -outline-offset-1 outline-white/10 hover:outline-2 hover:-outline-offset-2 hover:outline-blue-500 px-3 py-2 rounded-md">
                                    {ArrowLeftEndOnRectangleIcon && <ArrowLeftEndOnRectangleIcon className="h-6 w-6 text-white" />} Sign out <span aria-hidden="true"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-blue-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navWithCurrent.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {item.icon && <item.icon className="h-5 w-5" />}
                                {item.name}
                            </div>
                        </DisclosureButton>
                    ))}
                </div>
                <div className="border-t border-white/10 pt-4 pb-3 space-y-4">
                    <button type="button" className="flex items-center pb-3 pt-3 px-5 w-full text-left rounded-md cursor-pointer group bg-transparent hover:bg-white/5">
                        <div className="shrink-0">
                            <Avatar
                                src={getProfilePictureUrl(user)}
                                className="w-10 h-10"
                                isBordered
                                radius="full"
                                color="default"
                            />
                        </div>
                        <Link href={`/user/${user.slug}`}>
                            <div className="ml-3">
                                <div className="text-base/5 font-medium text-gray-400 group-hover:text-white transition-colors duration-200">
                                    {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-200">
                                    {user.email}
                                </div>
                            </div>
                        </Link>
                    </button>
                    <button type="button" className="flex items-center pb-6 pt-6 px-7 w-full text-left hover:bg-white/5 rounded-md cursor-pointer">
                        <button onClick={logout} className="text-base/5 font-medium text-white">
                            Sign out <span aria-hidden="true">&rarr;</span>
                        </button>
                    </button>
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}
