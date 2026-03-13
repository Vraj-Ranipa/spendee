
"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ProjectFinancialsProps {
    expenses: any[];
    incomes: any[];
}

export function ProjectFinancials({ expenses, incomes }: ProjectFinancialsProps) {
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-background border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute -bottom-6 -right-6 text-emerald-500/10 dark:text-emerald-400/5">
                    <TrendingUp className="h-32 w-32 -rotate-12" />
                </div>
                <CardContent className="p-3 flex flex-col items-center justify-center text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 w-full mb-1">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-3 w-3" />
                        </div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Income</p>
                    </div>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(totalIncome)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        From {incomes.length} transactions
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/40 dark:to-background border-rose-100 dark:border-rose-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                 <div className="absolute -bottom-6 -right-6 text-rose-500/10 dark:text-rose-400/5">
                    <TrendingDown className="h-32 w-32 -rotate-12" />
                </div>
                <CardContent className="p-3 flex flex-col items-center justify-center text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 w-full mb-1">
                        <div className="h-6 w-6 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <TrendingDown className="h-3 w-3" />
                        </div>
                        <p className="text-sm font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">Total Expenses</p>
                    </div>
                    <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                        {formatCurrency(totalExpense)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        From {expenses.length} transactions
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-background border-blue-100 dark:border-blue-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                 <div className="absolute -bottom-6 -right-6 text-blue-500/10 dark:text-blue-400/5">
                    <Wallet className="h-32 w-32 -rotate-12" />
                </div>
                <CardContent className="p-3 flex flex-col items-center justify-center text-center relative z-10">
                     <div className="flex items-center justify-center gap-2 w-full mb-1">
                          <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                             <Wallet className="h-3 w-3" />
                         </div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Net Balance</p>
                    </div>
                    <div className={`text-2xl font-bold ${balance >= 0 ? "text-blue-700 dark:text-blue-300" : "text-rose-600"}`}>
                        {formatCurrency(balance)}
                    </div>
                     <p className="text-xs text-muted-foreground mt-0.5">
                        Available budget
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
