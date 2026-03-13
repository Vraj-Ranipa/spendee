"use client";

import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";

interface CategoryFinancialsProps {
    expenses: any[];
    incomes: any[];
    type?: 'expense' | 'income' | 'mixed';
}

export function CategoryFinancials({ expenses, incomes, type = 'mixed' }: CategoryFinancialsProps) {
    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    const netFlow = totalIncome - totalExpense;

    const showExpense = type === 'expense' || type === 'mixed';
    const showIncome = type === 'income' || type === 'mixed';
    const showNet = type === 'mixed';

    // Adjust grid based on visible cards
    const gridClass = cn(
        "grid gap-4",
        type === 'mixed' ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-3"
    );

    return (
        <div className={gridClass}>
            {showExpense && (
                <Card className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/40 dark:to-background border-rose-100 dark:border-rose-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                    <div className="absolute -bottom-6 -right-6 text-rose-500/10 dark:text-rose-400/5 group-hover:scale-110 transition-transform duration-500">
                        <TrendingDown className="h-32 w-32 -rotate-12" />
                    </div>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center relative z-10">
                        <div className="flex items-center justify-center gap-2 w-full mb-2">
                            <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
                                <TrendingDown className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Total Expense</p>
                        </div>
                        <div className="text-3xl font-bold text-rose-700 dark:text-rose-300 tracking-tight">
                            {formatCurrency(totalExpense)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">
                            {expenses.length} transactions
                        </p>
                    </CardContent>
                </Card>
            )}

            {showIncome && (
                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-background border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                    <div className="absolute -bottom-6 -right-6 text-emerald-500/10 dark:text-emerald-400/5 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="h-32 w-32 -rotate-12" />
                    </div>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center relative z-10">
                        <div className="flex items-center justify-center gap-2 w-full mb-2">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Income</p>
                        </div>
                        <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 tracking-tight">
                            {formatCurrency(totalIncome)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                            {incomes.length} transactions
                        </p>
                    </CardContent>
                </Card>
            )}

            {showNet && (
                <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-background border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                    <div className="absolute -bottom-6 -right-6 text-indigo-500/10 dark:text-indigo-400/5 group-hover:scale-110 transition-transform duration-500">
                        <Wallet className="h-32 w-32 -rotate-12" />
                    </div>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center relative z-10">
                        <div className="flex items-center justify-center gap-2 w-full mb-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                                <Wallet className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Net Flow</p>
                        </div>
                        <div className={`text-3xl font-bold tracking-tight ${netFlow >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
                            {formatCurrency(netFlow)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                             Overall Balance
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
