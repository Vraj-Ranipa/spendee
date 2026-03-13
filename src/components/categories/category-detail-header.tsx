"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash, Folder, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "@/components/shared/delete-button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryDetailHeaderProps {
    category: any;
}

export function CategoryDetailHeader({ category }: CategoryDetailHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex-none px-4 py-3 md:px-6 border-b border-border/60 bg-background/90 backdrop-blur-xl z-50 shadow-sm sticky top-0">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0 rounded-full hover:bg-muted/60">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-sm overflow-hidden">
                            {category.LogoPath ? (
                            <img 
                                src={category.LogoPath} 
                                alt={category.CategoryName} 
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Folder className="h-5 w-5" />
                        )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">{category.CategoryName}</h1>
                                {!category.IsActive && (
                                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Inactive</Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">Category Options</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs hover:border-orange-500/50 hover:bg-orange-500/5 transition-all px-3 hidden sm:flex">
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Category
                    </Button>
                     <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-0 text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                <DeleteButton
                                    model="categories"
                                    id={category.CategoryID.toString()}
                                    redirectTo="/admin/categories"
                                    deleteLabel="Delete Category"
                                    variant="ghost"
                                    className="w-full justify-start h-auto p-2 text-destructive hover:text-destructive hover:bg-transparent"
                                />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DeleteButton 
                        model="categories" 
                        id={category.CategoryID.toString()} 
                        redirectTo="/admin/categories"
                        className="h-8 text-xs shadow-sm hover:shadow-md transition-all px-3 hidden sm:flex"
                        variant="destructive"
                        deleteLabel="Delete"
                    />
                </div>
            </div>
        </div>
    );
}
