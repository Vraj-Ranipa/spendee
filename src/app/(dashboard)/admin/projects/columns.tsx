"use client";

import { Logo } from "@/components/shared/logo";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionMenu } from "@/components/shared/action-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type Project = {
    ProjectID: number;
    ProjectLogo: string | null;
    ProjectName: string;
    ProjectStartDate: Date | null;
    ProjectEndDate: Date | null;
    IsActive: boolean | null;
    Description: string | null;
    ProjectDetail: string | null;
};

export const columns: ColumnDef<Project>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "ProjectID",
        header: "ID",
    },
    {
        id: "ProjectLogo",
        header: "Logo",
        cell: ({ row }) => {
            const logo = row.original.ProjectLogo;
            return (
                <Logo
                    path={logo}
                    alt={row.original.ProjectName || "Project Logo"}
                    fallbackClassName="h-10 w-10 rounded-md bg-slate-100 dark:bg-slate-800"
                    fallbackIcon={null}
                />
            );
        },
    },
    {
        accessorKey: "ProjectName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Project Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Link
                    href={`/admin/projects/${row.original.ProjectID}`}
                    className="font-medium hover:text-primary transition-all cursor-pointer"
                >
                    {row.getValue("ProjectName")}
                </Link>
            );
        },
    },
    {
        accessorKey: "ProjectStartDate",
        header: "Start Date",
        cell: ({ row }) => {
            const date = row.getValue("ProjectStartDate");
            if (!date) return <div className="text-muted-foreground">-</div>;
            return <div>{new Date(date as string).toDateString()}</div>;
        },
    },
    {
        accessorKey: "ProjectEndDate",
        header: "End Date",
        cell: ({ row }) => {
            const date = row.getValue("ProjectEndDate");
            if (!date) return <div className="text-muted-foreground">-</div>;
            return <div>{new Date(date as string).toDateString()}</div>;
        },
    },
    {
        accessorKey: "IsActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("IsActive");
            return (
                <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={
                        isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-100 dark:bg-slate-800 dark:text-slate-300"
                    }
                >
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "Description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("Description") as string;
            return (
                <div
                    className="max-w-[200px] truncate"
                    title={description || ""}
                >
                    {description || "-"}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const project = row.original;
            return (
                <ActionMenu
                    align="end"
                    viewHref={`/admin/projects/${project.ProjectID}`}
                    editHref={`/admin/projects/edit/${project.ProjectID}`}
                    editLabel="Edit Project"
                    model="projects"
                    id={project.ProjectID.toString()}
                    deletePath="/admin/projects"
                    deleteLabel="Delete Project"
                    className="h-8 w-8 p-0"
                />
            );
        },
    },
];
