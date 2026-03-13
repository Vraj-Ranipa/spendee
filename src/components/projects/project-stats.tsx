import { Briefcase, Rocket, Archive, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProjectStatsProps {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    completionRate: number
}

export function ProjectStats({
    totalProjects,
    activeProjects,
    completedProjects,
    completionRate,
}: ProjectStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                        <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalProjects}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        All recorded projects
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background border-emerald-200 dark:border-emerald-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900">
                        <Rocket className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {activeProjects}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Currently in progress
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-background border-orange-200 dark:border-orange-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed / Inactive</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center dark:bg-orange-900">
                        <Archive className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {completedProjects}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Archived or finished
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-50 to-white dark:from-violet-950 dark:to-background border-violet-200 dark:border-violet-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center dark:bg-violet-900">
                        <PieChart className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        {completionRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Overall success rate
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}


