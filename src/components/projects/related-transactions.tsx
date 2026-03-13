
"use client";

import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Calendar, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface RelatedTransactionsProps {
    expenses: any[];
    incomes: any[];
}

export function RelatedTransactions({ expenses, incomes }: RelatedTransactionsProps) {
    return (
        <Card className="h-full border-none shadow-none bg-transparent flex flex-col px-4 sm:px-6">
            <CardHeader className="px-0 pt-0 shrink-0">
                <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-primary" />
                    Transactions
                </CardTitle>
                <CardDescription>Recent financial activity for this project</CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex-1 min-h-0 flex flex-col">
                <Tabs defaultValue="expenses" className="w-full h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-4 shrink-0">
                        <TabsTrigger value="expenses" className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-900 dark:data-[state=active]:bg-rose-900/20 dark:data-[state=active]:text-rose-300">
                            Expenses ({expenses.length})
                        </TabsTrigger>
                        <TabsTrigger value="incomes" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-300">
                            Income ({incomes.length})
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="expenses" className="flex-1 min-h-0 mt-0">
                        {expenses.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed m-4">
                                <p>No expenses recorded yet.</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[400px] md:h-[500px] lg:h-[600px] rounded-md border bg-background w-full">
                                <div className="p-3 grid gap-2 w-max min-w-full">
                                    {expenses.map((expense) => (
                                        <Link href={`/expenses/${expense.ExpenseID}`} key={expense.ExpenseID} className="flex items-center gap-32 p-2.5 rounded-lg border bg-card hover:bg-muted/40 transition-all hover:border-primary/40 hover:shadow-md group cursor-pointer w-full">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="h-8 w-8 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 w-[140px] sm:w-[200px] shrink-0 pr-2">
                                                    <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                                        {expense.ExpenseDetail || expense.categories?.CategoryName || "Expense"}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 min-w-0">
                                                        <span className="flex items-center gap-1 shrink-0">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(new Date(expense.ExpenseDate), "MMM d")}
                                                        </span>
                                                        {expense.categories && (
                                                            <>
                                                                <span className="text-muted-foreground/30 shrink-0">•</span>
                                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 min-w-0 shrink truncate font-normal bg-muted max-w-[80px] sm:max-w-[100px]">
                                                                    {expense.categories.CategoryName}
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 pl-1 w-[80px] sm:w-[100px]">
                                                <p className="font-bold text-sm sm:text-base text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                                    -{formatCurrency(Number(expense.Amount))}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="incomes" className="flex-1 min-h-0 mt-0">
                         {incomes.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed m-4">
                                <p>No income recorded yet.</p>
                            </div>
                        ) : (
                             <ScrollArea className="h-[400px] md:h-[500px] lg:h-[600px] rounded-md border bg-background w-full">
                                <div className="p-3 grid gap-2 w-max min-w-full">
                                    {incomes.map((income) => (
                                        <Link href={`/incomes/${income.IncomeID}`} key={income.IncomeID} className="flex items-center gap-32 p-2.5 rounded-lg border bg-card hover:bg-muted/40 transition-all hover:border-primary/40 hover:shadow-md group cursor-pointer w-full">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="h-8 w-8 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <ArrowDownLeft className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 w-[140px] sm:w-[200px] shrink-0 pr-2">
                                                    <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                                        {income.IncomeDetail || income.categories?.CategoryName || "Income"}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 min-w-0">
                                                        <span className="flex items-center gap-1 shrink-0">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(new Date(income.IncomeDate), "MMM d")}
                                                        </span>
                                                        {income.categories && (
                                                            <>
                                                                <span className="text-muted-foreground/30 shrink-0">•</span>
                                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 min-w-0 shrink truncate font-normal bg-muted max-w-[80px] sm:max-w-[100px]">
                                                                    {income.categories.CategoryName}
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 pl-1 w-[80px] sm:w-[100px]">
                                                <p className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                                    +{formatCurrency(Number(income.Amount))}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                             </ScrollArea>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
