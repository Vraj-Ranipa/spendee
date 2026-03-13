import { Users, UserCheck, UserX, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PeopleStatsProps {
    totalPeople: number
    activePeople: number
    inactivePeople: number
    newlyAdded: number
}

export function PeopleStats({
    totalPeople,
    activePeople,
    inactivePeople,
    newlyAdded,
}: PeopleStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total People</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalPeople}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        All registered people
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background border-emerald-200 dark:border-emerald-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active People</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900">
                        <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {activePeople}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Currently active
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-background border-orange-200 dark:border-orange-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inactive / Archived</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center dark:bg-orange-900">
                        <UserX className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {inactivePeople}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Inactive or removed
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-200 dark:border-purple-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Newly Added</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900">
                        <UserPlus className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {newlyAdded}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Added this month
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
