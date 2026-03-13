"use client";

import { format } from "date-fns";
import { 
    Info, Calendar, Clock, CheckCircle2, FileText, 
    Layers, TrendingDown, TrendingUp, Wallet 
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryInfoProps {
    category: any;
    expenses?: any[];
    incomes?: any[];
}

export function CategoryInfo({ category, expenses = [], incomes = [] }: CategoryInfoProps) {
    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    
    const isExpense = category.IsExpense && !category.IsIncome;
    const isIncome = category.IsIncome && !category.IsExpense;
    const isMixed = !isExpense && !isIncome;
    
    return (
        <Card className="relative overflow-hidden shadow-sm bg-gradient-to-br from-background via-background to-primary/10 border-muted/60 hover:border-primary/20 transition-colors w-full">
            {/* Decorative Background Icon */}
            <div className="absolute -top-6 -right-6 opacity-[0.05] pointer-events-none">
                <Info className="h-32 w-32 text-primary" />
            </div>
            
            <CardHeader className="px-4 pt-0 pb-1 relative z-10">
                <CardTitle className="flex items-center gap-3 text-lg font-medium text-muted-foreground">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Info className="h-4.5 w-4.5 text-primary" />
                    </div>
                    About this Category
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-4 relative z-10">
                
                {/* TOP SECTION: Financials & Description */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    
                    {/* Financial Summary */}
                    <div className="min-w-0">
                        {isExpense && (
                            <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-50 via-white to-rose-50/50 dark:from-rose-950/40 dark:via-background dark:to-rose-950/10 border border-rose-100 dark:border-rose-900/50 flex flex-row items-center justify-between gap-3 shadow-sm h-full">
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 truncate">Total Expense</p>
                                    <div className="text-xl sm:text-2xl font-bold text-rose-700 dark:text-rose-300 truncate">
                                        {formatCurrency(totalExpense)}
                                    </div>
                                    <p className="text-[10px] font-medium text-rose-600/80 dark:text-rose-400/80 truncate">
                                        {expenses.length} Transactions
                                    </p>
                                </div>
                                <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-rose-100 to-white dark:from-rose-900 dark:to-rose-950 shadow-sm border border-rose-200/50 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                    <TrendingDown className="h-5 w-5" />
                                </div>
                            </div>
                        )}
                        
                        {isIncome && (
                             <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-950/40 dark:via-background dark:to-emerald-950/10 border border-emerald-100 dark:border-emerald-900/50 flex flex-row items-center justify-between gap-3 shadow-sm h-full">
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">Total Income</p>
                                    <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300 truncate">
                                        {formatCurrency(totalIncome)}
                                    </div>
                                    <p className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80 truncate">
                                        {incomes.length} Transactions
                                    </p>
                                </div>
                                <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-white dark:from-emerald-900 dark:to-emerald-950 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        )}

                        {isMixed && (
                             <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 dark:from-indigo-950/40 dark:via-background dark:to-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 flex flex-row items-center justify-between gap-3 shadow-sm h-full">
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 truncate">Net Flow</p>
                                    <div className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300 truncate">
                                        {formatCurrency(totalIncome - totalExpense)}
                                    </div>
                                    <p className="text-[10px] font-medium text-indigo-600/80 dark:text-indigo-400/80 truncate">
                                        {incomes.length} In • {expenses.length} Out
                                    </p>
                                </div>
                                <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900 dark:to-indigo-950 shadow-sm border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Wallet className="h-5 w-5" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description Box */}
                    <div className="bg-muted/10 rounded-lg border border-border/40 p-3 h-full min-h-[80px] flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide">Description</span>
                        </div>
                        <p className="text-xs leading-relaxed text-foreground/80 line-clamp-3">
                            {category.Description || <span className="italic text-muted-foreground/60">No description provided for this category.</span>}
                        </p>
                    </div>
                </div>

                {/* BOTTOM SECTION: Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Created */}
                    <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40 min-w-0">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                            <Calendar className="h-3 w-3" /> Created
                        </span>
                        <p className="font-medium text-xs mt-1 truncate">
                            {category.Created ? format(new Date(category.Created), "MMM d, yyyy") : "N/A"}
                        </p>
                    </div>

                    {/* Modified */}
                    <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40 min-w-0">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                            <Clock className="h-3 w-3" /> Modified
                        </span>
                        <p className="font-medium text-xs mt-1 truncate">
                            {category.Modified ? format(new Date(category.Modified), "MMM d, yyyy") : "N/A"}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40 min-w-0">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                            <CheckCircle2 className="h-3 w-3" /> Status
                        </span>
                        <div className="mt-1">
                             <Badge variant={category.IsActive ? "outline" : "destructive"} className={`h-5 px-1.5 text-[10px] ${category.IsActive ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900" : ""}`}>
                                {category.IsActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    {/* Type */}
                    <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40 min-w-0">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                            <Layers className="h-3 w-3" /> Type
                        </span>
                        <p className="font-medium text-xs mt-1 truncate">
                            {isMixed ? "Mixed" : isExpense ? "Expense" : "Income"}
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
