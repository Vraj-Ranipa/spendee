import { DollarSign, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Activity } from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface StatsCardsProps {
    data: {
        totalBalance: number;
        totalIncome: number;
        totalExpenses: number;
        activeProjects: number;
        balanceChange?: number;
        incomeChange?: number;
        expenseChange?: number;
        newProjects?: number;
    }
}

export function StatsCards({ data }: StatsCardsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
    };

    // Helper to format percentage
    const formatPercent = (value?: number) => {
        if (value === undefined || isNaN(value)) return "0.0%";
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-background border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Balance
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{formatCurrency(data.totalBalance)}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className={`flex items-center mr-1 px-1.5 py-0.5 rounded-full font-medium ${data.balanceChange && data.balanceChange >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"}`}>
                            {data.balanceChange && data.balanceChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />} {formatPercent(data.balanceChange)}
                        </span>
                        from last month
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background border-emerald-200 dark:border-emerald-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Income
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{formatCurrency(data.totalIncome)}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className={`flex items-center mr-1 px-1.5 py-0.5 rounded-full font-medium ${data.incomeChange && data.incomeChange >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"}`}>
                            {data.incomeChange && data.incomeChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />} {formatPercent(data.incomeChange)}
                        </span>
                         from last month
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950 dark:to-background border-rose-200 dark:border-rose-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-rose-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{formatCurrency(data.totalExpenses)}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className={`flex items-center mr-1 px-1.5 py-0.5 rounded-full font-medium ${data.expenseChange && data.expenseChange >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"}`}>
                            {data.expenseChange && data.expenseChange > 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />} {formatPercent(data.expenseChange)}
                        </span>
                        from last month
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Active Projects
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                         <Activity className="h-4 w-4 text-blue-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{data.activeProjects}</div>
                     <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="text-blue-500 flex items-center mr-1 bg-blue-500/10 px-1.5 py-0.5 rounded-full font-medium">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> {data.newProjects || 0}
                        </span>
                        new projects this month
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
