import { Layers, FolderTree, CheckCircle, PlusSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoriesStatsProps {
    totalCategories: number
    totalSubCategories: number
    activeCategories: number
    newlyAdded: number
}

export function CategoriesStats({
    totalCategories,
    totalSubCategories,
    activeCategories,
    newlyAdded,
}: CategoriesStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                        <Layers className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalCategories}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Main categories
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-background border-indigo-200 dark:border-indigo-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sub-Categories</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center dark:bg-indigo-900">
                        <FolderTree className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {totalSubCategories}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Across all categories
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background border-emerald-200 dark:border-emerald-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900">
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {activeCategories}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Currently active
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-200 dark:border-purple-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Newly Added</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900">
                        <PlusSquare className="h-4 w-4 text-purple-600 dark:text-purple-300" />
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
