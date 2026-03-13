import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/serialization";

import { ProjectGrid } from "@/components/projects/project-grid";
import { ProjectStats } from "@/components/projects/project-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProjectsPage() {
    const projectsList = await prisma.projects.findMany({
        orderBy: {
            Created: 'desc'
        }
    });

    const totalProjects = projectsList.length;
    const activeProjects = projectsList.filter(p => p.IsActive).length;
    const completedProjects = totalProjects - activeProjects;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        Manage and track your projects.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild variant="default" >
                        <Link href="/admin/projects/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Project
                        </Link>
                    </Button>
                </div>
            </div>

            <ProjectStats
                totalProjects={totalProjects}
                activeProjects={activeProjects}
                completedProjects={completedProjects}
                completionRate={completionRate}
            />

            <div className="mt-6">
                <Card className="border-0 shadow-none bg-transparent md:border md:shadow-sm md:bg-card">
                    <CardHeader className="px-0 md:px-6">
                        <CardTitle>All Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 md:px-6">
                        <ProjectGrid data={serializeData(projectsList)} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
