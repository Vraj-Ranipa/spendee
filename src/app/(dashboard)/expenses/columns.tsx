"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionMenu } from "@/components/shared/action-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type Expense = {
    ExpenseID: number;
    ExpenseDate: string;
    Amount: number;
    ExpenseDetail: string | null;
    Description: string | null;
    AttachmentPath: string | null;
    categories: { CategoryName: string } | null;
    sub_categories: { SubCategoryName: string } | null;
    projects: { ProjectName: string } | null;
    peoples: { PeopleName: string } | null;
    Created: string;
    Modified: string;
};

export const columns: ColumnDef<Expense>[] = [
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
        accessorKey: "ExpenseID",
        header: "ID",
    },
    {
        accessorKey: "ExpenseDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Expense Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("ExpenseDate"));
            return <div>{date.toDateString()}</div>;
        },
    },

    {
        accessorKey: "Amount",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("Amount"));
            const formatted = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(amount);

            return (
                <div className="text-right">
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                        {formatted}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "categories.CategoryName",
        id: "Category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.categories;
            return <div className="font-medium">{category?.CategoryName || "-"}</div>;
        },
    },
    {
        accessorKey: "sub_categories.SubCategoryName",
        id: "SubCategory",
        header: "Sub Category",
        cell: ({ row }) => {
            const sub = row.original.sub_categories;
            return (
                <div className="text-muted-foreground">
                    {sub?.SubCategoryName || "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "projects.ProjectName",
        id: "Project",
        header: "Project",
        cell: ({ row }) => {
            const project = row.original.projects;
            return (
                <div className="text-muted-foreground">
                    {project?.ProjectName || "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "peoples.PeopleName",
        id: "People",
        header: "People",
        cell: ({ row }) => {
            const people = row.original.peoples;
            return (
                <div className="text-muted-foreground">{people?.PeopleName || "-"}</div>
            );
        },
    },
    {
        accessorKey: "ExpenseDetail",
        header: "Details",
    },
    {
        accessorKey: "Description",
        header: "Description",
        cell: ({ row }) => (
            <div
                className="max-w-[200px] truncate"
                title={row.getValue("Description")}
            >
                {row.getValue("Description")}
            </div>
        ),
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const expense = row.original;

            return (
                <ActionMenu
                    align="end"
                    viewHref={`/expenses/${expense.ExpenseID}`}
                    editHref={`/expenses/edit/${expense.ExpenseID}`}
                    model="expenses"
                    id={expense.ExpenseID.toString()}
                    deletePath="/expenses"
                    className="h-8 w-8 p-0"
                />
            );
        },
    },
];
