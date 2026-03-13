"use client";

import Link from "next/link";
import { MoreHorizontal, Edit, Trash, Eye, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import DeleteButton from "./delete-button";

interface ActionMenuProps {
    editHref?: string;
    editLabel?: string;
    viewHref?: string;
    deleteLabel?: string;
    className?: string;
    align?: "end" | "start" | "center";
    model?: string;
    id?: string;
    deletePath?: string;
    redirectTo?: string;
}

export function ActionMenu({
    editHref,
    editLabel = "Edit",
    viewHref,
    
    deleteLabel = "Delete",
    className,
    align = "end",
    model,
    id,
    deletePath,
    redirectTo,
}: ActionMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                        "h-8 w-8 rounded-full bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50", 
                        className
                    )}
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="min-w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {viewHref && (
                    <DropdownMenuItem asChild>
                        <Link href={viewHref}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                )}

                {editHref && (
                    <DropdownMenuItem asChild>
                        <Link href={editHref}>
                            <Edit className="mr-2 h-4 w-4" />
                            {editLabel}
                        </Link>
                    </DropdownMenuItem>
                )}

                {(viewHref || editHref) && (model && id) && <DropdownMenuSeparator />}
                {(model && id) && (
                    <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 p-0"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <DeleteButton
                            model={model}
                            id={id}
                            path={deletePath}
                            redirectTo={redirectTo}
                            deleteLabel={deleteLabel}
                            className="w-full justify-start h-auto p-2 hover:bg-transparent hover:text-red-600"
                            variant="ghost"
                        />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
