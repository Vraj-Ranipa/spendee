"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface PeopleFinancialsProps {
    expenses: any[];
    incomes: any[];
}

export function PeopleFinancials({ expenses, incomes }: PeopleFinancialsProps) {
    const totalPaid = expenses.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    const totalReceived = incomes.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    // Net Balance for a person: (Received - Paid) usually implies how much they 'have' relative to you, 
    // BUT effectively 'Net Balance' usually means (Total In - Total Out) in a wallet context.
    // In "People" context: 
    // If I paid them 1000 and received 500, I am -500 net with them? 
    // Or is it a simple summary of transactions?
    // Let's stick to simple Net Balance = Income - Expense (Received - Paid)
    const netBalance = totalReceived - totalPaid;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/40 dark:to-background border-rose-100 dark:border-rose-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                 <div className="absolute -bottom-6 -right-6 text-rose-500/10 dark:text-rose-400/5 group-hover:scale-110 transition-transform duration-500">
                    <TrendingDown className="h-32 w-32 -rotate-12" />
                </div>
                <CardContent className="py-1 px-3 flex flex-col items-center justify-center text-center relative z-10">
                    <div className="flex items-center justify-center gap-1.5 w-full mb-0">
                        <div className="h-6 w-6 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <TrendingDown className="h-3 w-3" />
                        </div>
                        <p className="text-sm font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">Total Paid To</p>
                    </div>
                    <div className="text-xl font-bold text-rose-700 dark:text-rose-300">
                        {formatCurrency(totalPaid)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0">
                        In {expenses.length} transactions
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-background border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                <div className="absolute -bottom-6 -right-6 text-emerald-500/10 dark:text-emerald-400/5 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="h-32 w-32 -rotate-12" />
                </div>
                <CardContent className="py-1 px-3 flex flex-col items-center justify-center text-center relative z-10">
                    <div className="flex items-center justify-center gap-1.5 w-full mb-0">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-3 w-3" />
                        </div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Received</p>
                    </div>
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(totalReceived)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0">
                        In {incomes.length} transactions
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-background border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                 <div className="absolute -bottom-6 -right-6 text-indigo-500/10 dark:text-indigo-400/5 group-hover:scale-110 transition-transform duration-500">
                    <Wallet className="h-32 w-32 -rotate-12" />
                </div>
                <CardContent className="py-1 px-3 flex flex-col items-center justify-center text-center relative z-10">
                     <div className="flex items-center justify-center gap-1.5 w-full mb-0">
                          <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                             <Wallet className="h-3 w-3" />
                         </div>
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Net Balance</p>
                    </div>
                    <div className={`text-xl font-bold ${netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {netBalance > 0 ? "+" : ""}{formatCurrency(netBalance)}
                    </div>
                     <p className="text-xs text-muted-foreground mt-0">
                        Current Standing
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
