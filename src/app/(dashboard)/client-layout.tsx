"use client"
import React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
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
        <SidebarProvider>
            <AppSidebar userRole={userRole} user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
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
                    <div className="ml-auto">
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-0 md:p-4 md:pt-0">
                    {children}
                    {modal}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
