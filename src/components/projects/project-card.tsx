
import { format } from "date-fns";
import {
    Copy,
    Calendar,
    MoreHorizontal,
    Briefcase,
    Clock,
    CheckCircle2,
    XCircle,
    Edit,
    Trash,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionMenu } from "@/components/shared/action-menu";

export interface ProjectCardProps {
    project: {
        ProjectID: number;
        ProjectLogo: string | null;
        ProjectName: string;
        ProjectStartDate: Date | null;
        ProjectEndDate: Date | null;
        IsActive: boolean | null;
        Description: string | null;
        ProjectDetail: string | null;
    }
}

export function ProjectCard({ project }: ProjectCardProps) {
    const isActive = project.IsActive;



    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-300 py-0 gap-0",
            "hover:shadow-xl hover:-translate-y-1 border",
            isActive
                ? "bg-gradient-to-br from-indigo-50/50 via-white to-white dark:from-indigo-900/20 dark:via-slate-950 dark:to-slate-950"
                : "bg-gradient-to-br from-slate-100/50 via-white to-white dark:from-slate-800/20 dark:via-slate-950 dark:to-slate-950"
        )}>
            <div className="absolute -right-2 -bottom-6 opacity-5 dark:opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                <Briefcase className="h-40 w-40 text-indigo-500 dark:text-indigo-400" />
            </div>

            <div className="flex items-center justify-between px-3 pt-2 pb-0 relative z-20">
                <Badge
                    variant="secondary"
                    className={cn(
                        "px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border shadow-sm",
                        isActive
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/30"
                            : "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800"
                    )}
                >
                    {isActive ? "Active Project" : "Archived"}
                </Badge>

                <ActionMenu
                    align="end"
                    viewHref={`/admin/projects/${project.ProjectID}`}
                    editHref={`/admin/projects/edit/${project.ProjectID}`}
                    editLabel="Edit Project"
                    model="projects"
                    id={project.ProjectID.toString()}
                    deletePath="/admin/projects"
                    deleteLabel="Delete Project"
                    className="h-7 w-7 bg-white/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 shadow-sm backdrop-blur-sm -mr-1"
                />
            </div>

            <CardContent className="pt-2 pb-5 px-5 space-y-5 relative z-10">
                <Link href={`/admin/projects/${project.ProjectID}`} className="block h-full group/link">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className={cn(
                            "p-1 rounded-2xl shadow-sm border transition-colors group-hover/link:border-primary/30",
                            isActive
                                ? "bg-gradient-to-br from-indigo-50 to-white border-indigo-100 dark:from-indigo-950/20 dark:to-slate-950 dark:border-indigo-900/30"
                                : "bg-gradient-to-br from-slate-50 to-white border-slate-100 dark:from-slate-900/20 dark:to-slate-950 dark:border-slate-800"
                        )}>
                            <Logo
                                path={project.ProjectLogo}
                                alt={project.ProjectName}
                                fallbackClassName={cn(
                                    "h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center transition-all duration-300",
                                    isActive ? "text-indigo-500" : "text-slate-500"
                                )}
                                fallbackIcon={<Briefcase className="h-6 w-6 sm:h-7 sm:w-7" />}
                            />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1 transition-all duration-300 group-hover/link:text-primary">
                                {project.ProjectName}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-xs">
                                {isActive ? (
                                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </span>
                                        In Progress
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                        <XCircle className="h-3 w-3" /> Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800 min-h-[4.5rem] mt-5">
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words break-all">
                            {project.Description || "No description provided for this project."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mt-5">
                        <div className="p-2 rounded-lg border bg-background/50 backdrop-blur-sm shadow-sm transition-colors group-hover/link:border-primary/20">
                            <p className="text-muted-foreground mb-1 font-medium text-[9px] uppercase tracking-wider flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5 opacity-70" />
                                Start Date
                            </p>
                            <div className="font-semibold text-foreground">
                                {project.ProjectStartDate ? format(new Date(project.ProjectStartDate), 'MMM d, yyyy') : '-'}
                            </div>
                        </div>
                        <div className="p-2 rounded-lg border bg-background/50 backdrop-blur-sm shadow-sm transition-colors group-hover/link:border-primary/20">
                            <p className="text-muted-foreground mb-1 font-medium text-[9px] uppercase tracking-wider flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5 opacity-70" />
                                End Date
                            </p>
                            <div className="font-semibold text-foreground">
                                {project.ProjectEndDate ? format(new Date(project.ProjectEndDate), 'MMM d, yyyy') : 'Ongoing'}
                            </div>
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}
