"use client"
import React from "react";
import { usePathname } from "next/navigation";
import { AppNavbar } from "@/components/shared/app-navbar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


export default function DashboardClientLayout({
    children,
    modal,
    userRole,
    user,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
    userRole: string;
    user: any; // Or proper type
}) {
    const pathname = usePathname();
    const breadcrumbSegments = pathname === "/" ? [] : pathname.split("/").filter((segment) => segment);

    return (
        <div className="flex min-h-screen flex-col">
            <AppNavbar userRole={userRole} user={user} />
            <main className="flex-1">
                <header className="flex h-12 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbSegments.map((segment, index) => {
                                const href = `/${breadcrumbSegments.slice(0, index + 1).join("/")}`;
                                const isLast = index === breadcrumbSegments.length - 1;
                                const title = segment.charAt(0).toUpperCase() + segment.slice(1);

                                return (
                                    <React.Fragment key={segment}>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>{title}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={href}>
                                                    {title}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 md:pt-0">
                    {children}
                    {modal}
                </div>
            </main>
        </div>
    );
}

