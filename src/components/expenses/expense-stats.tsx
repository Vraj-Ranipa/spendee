import {  CreditCard, Activity, TrendingUp, IndianRupee } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface ExpenseStatsProps {
    totalExpense: number
    expenseCount: number
    averageExpense: number
    highestExpense: number
}

export function ExpenseStats({
    totalExpense,
    expenseCount,
    averageExpense,
    highestExpense,
}: ExpenseStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-background border-red-200 dark:border-red-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900">
                        <IndianRupee className="h-4 w-4 text-red-600 dark:text-red-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(totalExpense)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Total spending across all categories
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
                    <div className="text-2xl font-bold">{expenseCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Total expense transactions recorded
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-200 dark:border-purple-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900">
                        <Activity className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(averageExpense)}</div>
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
                    <div className="text-2xl font-bold">{formatCurrency(highestExpense)}</div>
                    <p className="text-xs text-muted-foreground">
                        Highest single transaction amount
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
