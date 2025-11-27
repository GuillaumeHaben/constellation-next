"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function BreadCrumbs({ currentPage, targetUser }) {
    const router = useRouter();

    return (
        <Breadcrumbs className="mt-1" underline="active" onAction={(key) => router.push("/" + key)}>
            <BreadcrumbItem key="home" isCurrent={currentPage === "home"}>
                Constellation
            </BreadcrumbItem>
            {currentPage === "clubs" && (
                <BreadcrumbItem key="clubs" isCurrent={true}>
                    Clubs
                </BreadcrumbItem>
            )}
            {currentPage === "users" && (
                <BreadcrumbItem key="users" isCurrent={true}>
                    Users
                </BreadcrumbItem>
            )}
            {currentPage === "marketPins" && (
                <BreadcrumbItem key="marketPins" isCurrent={true}>
                    MarketPins
                </BreadcrumbItem>
            )}
            {currentPage?.startsWith("user/") && (
                <BreadcrumbItem key="users" isCurrent={false}>
                    Users
                </BreadcrumbItem>
            )}
            {currentPage?.startsWith("user/") && (
                <BreadcrumbItem key={currentPage} isCurrent={true}>
                    {targetUser?.firstName} {targetUser?.lastName}
                </BreadcrumbItem>
            )}
        </Breadcrumbs>
    )
}