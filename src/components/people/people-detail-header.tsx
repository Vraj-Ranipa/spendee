"use client";

import Link from "next/link";
import { ArrowLeft, Edit, MoreHorizontal, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import DeleteButton from "@/components/shared/delete-button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PeopleDetailHeaderProps {
    person: {
        PeopleID: number;
        PeopleName: string;
        PeopleCode?: string | null;
        MobileNo?: string | null;
        Email?: string | null;
        IsActive?: boolean | null;
        users?: {
            ProfileImage?: string | null;
        } | null;
    };
}

export function PeopleDetailHeader({ person }: PeopleDetailHeaderProps) {
    return (
        <div className="flex-none px-4 py-3 md:px-6 border-b border-border/60 bg-background/90 backdrop-blur-xl z-50 shadow-sm sticky top-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted/80 transition-colors h-8 w-8">
                        <Link href="/admin/people">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full ring-2 ring-background shadow-md overflow-hidden">
                                    <Logo 
                                    path={person.users?.ProfileImage} 
                                    alt={person.PeopleName} 
                                    fallbackClassName="h-full w-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500"
                                    fallbackIcon={<User className="h-5 w-5" />}
                                />
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background flex items-center justify-center ${person.IsActive !== false ? "bg-emerald-500" : "bg-slate-400"}`}>
                                {/* Status Dot */}
                            </div>
                        </div>
                        
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                {person.PeopleName}
                                {person.IsActive !== false && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800">
                                        Active
                                    </Badge>
                                )}
                            </h1>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 rounded text-[10px]">#{person.PeopleCode || person.PeopleID}</span>
                                {person.MobileNo && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span>{person.MobileNo}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-12 md:ml-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all px-3 hidden sm:flex">
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Person
                    </Button>
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Person
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-0 text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                <DeleteButton
                                    model="peoples"
                                    id={person.PeopleID.toString()}
                                    redirectTo="/admin/people"
                                    deleteLabel="Delete Person"
                                    variant="ghost"
                                    className="w-full justify-start h-auto p-2 text-destructive hover:text-destructive hover:bg-transparent"
                                />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DeleteButton 
                        model="peoples" 
                        id={person.PeopleID.toString()} 
                        redirectTo="/admin/people"
                        className="h-8 text-xs shadow-sm hover:shadow-md transition-all px-3 hidden sm:flex"
                        variant="destructive"
                        deleteLabel="Delete"
                    />
                </div>
            </div>
        </div>
    );
}
