"use client";

import Link from "next/link";
import { format } from "date-fns";
import { 
    ArrowUpRight, ArrowDownLeft, Calendar, 
    Tag, ArrowRightLeft, FileText 
} from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryRelatedTransactionsProps {
    expenses: any[];
    incomes: any[];
    type?: 'expense' | 'income' | 'mixed';
}

export function CategoryRelatedTransactions({ expenses, incomes, type = 'mixed' }: CategoryRelatedTransactionsProps) {
    const allTransactions = [
        ...expenses.map(e => ({ ...e, type: 'expense', date: new Date(e.ExpenseDate) })),
        ...incomes.map(i => ({ ...i, type: 'income', date: new Date(i.IncomeDate) }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const defaultTab = type === 'income' ? 'incomes' : type === 'expense' ? 'expenses' : 'all';

    return (
        <Card className="h-full border-none shadow-none bg-transparent flex flex-col px-4 sm:px-6">
            <CardHeader className="px-0 pt-0 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ArrowRightLeft className="h-5 w-5 text-primary" />
                            Transaction History
                        </CardTitle>
                        <CardDescription>
                            {type === 'expense' ? 'All expense records' : type === 'income' ? 'All income records' : 'All financial interactions'}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="w-fit bg-background mt-1">
                        Total {type === 'expense' ? expenses.length : type === 'income' ? incomes.length : allTransactions.length} Records
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-0 flex-1 min-h-0 flex flex-col">
                <Tabs defaultValue={defaultTab} className="w-full h-full flex flex-col">
                    {type === 'mixed' && (
                        <div className="overflow-x-auto pb-2 sm:pb-0">
                            <TabsList className="w-full justify-start sm:w-auto grid grid-cols-3">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                                <TabsTrigger value="incomes">Incomes</TabsTrigger>
                            </TabsList>
                        </div>
                    )}
                    
                    <TabsContent value="all" className="flex-1 min-h-0 mt-2 sm:mt-4">
                        <ScrollArea className="h-[350px] md:h-[450px] lg:h-[500px] rounded-md border bg-background w-full">
                            <div className="p-4 space-y-4">
                                {allTransactions.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    allTransactions.map((t: any) => (
                                        <TransactionItem key={`${t.type}-${t.type === 'expense' ? t.ExpenseID : t.IncomeID}`} item={t} />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="expenses" className="flex-1 min-h-0 mt-2 sm:mt-4">
                        <ScrollArea className="h-[350px] md:h-[450px] lg:h-[500px] rounded-md border bg-background w-full">
                            <div className="p-4 space-y-4">
                                {expenses.length === 0 ? (
                                    <EmptyState type="expense" />
                                ) : (
                                    expenses.map((e) => (
                                        <TransactionItem key={`expense-${e.ExpenseID}`} item={{ ...e, type: 'expense', date: new Date(e.ExpenseDate) }} />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="incomes" className="flex-1 min-h-0 mt-2 sm:mt-4">
                        <ScrollArea className="h-[350px] md:h-[450px] lg:h-[500px] rounded-md border bg-background w-full">
                            <div className="p-4 space-y-4">
                                {incomes.length === 0 ? (
                                    <EmptyState type="income" />
                                ) : (
                                    incomes.map((i) => (
                                        <TransactionItem key={`income-${i.IncomeID}`} item={{ ...i, type: 'income', date: new Date(i.IncomeDate) }} />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

function TransactionItem({ item }: { item: any }) {
    const isExpense = item.type === 'expense';
    const date = item.ExpenseDate || item.IncomeDate;
    const amount = Number(item.Amount);
    const detail = item.ExpenseDetail || item.IncomeDetail;

    return (
        <Link href={isExpense ? `/expenses/${item.ExpenseID}` : `/incomes/${item.IncomeID}`} className="block group">
            <div className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-all hover:border-primary/40 hover:shadow-md">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                        "h-9 w-9 rounded flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300",
                        isExpense 
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" 
                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    )}>
                        {isExpense ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {detail || (isExpense ? "Expense Payment" : "Income Received")}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(date), "MMM d, yyyy")}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className={cn(
                        "font-bold text-sm",
                        isExpense ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                        {isExpense ? "-" : "+"}{formatCurrency(amount)}
                    </p>
                </div>
            </div>
        </Link>
    )
}

function EmptyState({ type }: { type?: 'expense' | 'income' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 border border-dashed rounded-xl">
             <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                 <FileText className="h-8 w-8 text-muted-foreground/50" />
             </div>
            <h3 className="text-sm font-semibold text-foreground">No Transactions</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {type === 'expense' 
                    ? "No expenses in this category." 
                    : type === 'income' 
                    ? "No income in this category."
                    : "No transactions found in this category."}
            </p>
        </div>
    )
}
