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
            {currentPage === "users" && (
                <BreadcrumbItem key="users" isCurrent={true}>
                    Users
                </BreadcrumbItem>
            )}
            {currentPage === "clubs" && (
                <BreadcrumbItem key="clubs" isCurrent={true}>
                    Clubs
                </BreadcrumbItem>
            )}
            {currentPage === "Map" && (
                <BreadcrumbItem key="map" isCurrent={true}>
                    Map
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
            {currentPage === "Changelog" && (
                <BreadcrumbItem key="changelog" isCurrent={true}>
                    Changelog
                </BreadcrumbItem>
            )}
            {currentPage === "info" && (
                <BreadcrumbItem key="info" isCurrent={true}>
                    Info
                </BreadcrumbItem>
            )}
            {currentPage === "feedback" && (
                <BreadcrumbItem key="feedback" isCurrent={true}>
                    Feedback
                </BreadcrumbItem>
            )}
            {currentPage === "Pin Approval" && (
                <BreadcrumbItem key="admin/approvals" isCurrent={true}>
                    Pin Approval
                </BreadcrumbItem>
            )}
            {currentPage?.startsWith("club/") && (
                <BreadcrumbItem key="clubs" isCurrent={false}>
                    Clubs
                </BreadcrumbItem>
            )}
            {currentPage?.startsWith("club/") && (
                <BreadcrumbItem key={currentPage} isCurrent={true}>
                    {currentPage.split("/")[1]}
                </BreadcrumbItem>
            )}
        </Breadcrumbs>
    )
}