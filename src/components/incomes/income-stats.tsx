import { IndianRupee, CreditCard, Activity, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface IncomeStatsProps {
    totalIncome: number
    incomeCount: number
    averageIncome: number
    highestIncome: number
}

export function IncomeStats({
    totalIncome,
    incomeCount,
    averageIncome,
    highestIncome,
}: IncomeStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background border-emerald-200 dark:border-emerald-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900">
                        <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(totalIncome)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Total earnings across all sources
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                        <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{incomeCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Total income transactions recorded
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-200 dark:border-purple-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Income</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900">
                        <Activity className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(averageIncome)}</div>
                    <p className="text-xs text-muted-foreground">
                        Average amount per transaction
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-background border-amber-200 dark:border-amber-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Highest Entry</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-900">
                        <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(highestIncome)}</div>
                    <p className="text-xs text-muted-foreground">
                        Highest single transaction amount
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
