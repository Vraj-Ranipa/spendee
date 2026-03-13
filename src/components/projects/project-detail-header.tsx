
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Clock, Edit, Trash2, MoreHorizontal } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "@/components/shared/delete-button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectDetailHeaderProps {
    project: {
        ProjectID: number;
        ProjectName: string;
        ProjectLogo: string | null;
        Created: Date | string;
        IsActive: boolean | null;
        Description: string | null;
    }
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
    return (
        <div className="flex-none px-4 py-3 md:px-6 border-b border-border/60 bg-background/90 backdrop-blur-xl z-50 shadow-sm sticky top-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted/80 transition-colors h-8 w-8">
                        <Link href="/admin/projects">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    
                    <div className="flex items-center gap-3">
                         <Logo 
                            path={project.ProjectLogo} 
                            alt={project.ProjectName} 
                            fallbackClassName="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold"
                            fallbackIcon={null}
                        />
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent line-clamp-1">
                                    {project.ProjectName}
                                </h1>
                                <Badge variant="outline" className="font-mono text-xs h-5 px-1.5 bg-background/50 backdrop-blur-sm border-primary/20">
                                    #{project.ProjectID}
                                </Badge>
                                 {project.IsActive ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/30 h-5 text-[10px] px-1.5">Active</Badge>
                                ) : (
                                    <Badge variant="secondary" className="h-5 text-[10px] px-1.5">Inactive</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                 <Clock className="h-3 w-3" />
                                 <span>Created {format(new Date(project.Created), "PPP")}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all px-3 hidden sm:flex">
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Project
                    </Button>
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-0 text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                <DeleteButton
                                    model="projects"
                                    id={project.ProjectID.toString()}
                                    redirectTo="/admin/projects"
                                    deleteLabel="Delete Project"
                                    variant="ghost"
                                    className="w-full justify-start h-auto p-2 text-destructive hover:text-destructive hover:bg-transparent"
                                />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DeleteButton 
                        model="projects" 
                        id={project.ProjectID.toString()} 
                        redirectTo="/admin/projects"
                        className="h-8 text-xs shadow-sm hover:shadow-md transition-all px-3 hidden sm:flex"
                        variant="destructive"
                    />
                </div>
            </div>
        </div>
    );
}
