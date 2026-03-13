"use client";

import Link from "next/link";
import { format } from "date-fns";
import { 
    ArrowUpRight, ArrowDownLeft, FileText, 
    Calendar, Tag, Folder, ArrowRightLeft 
} from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PeopleRelatedTransactionsProps {
    expenses: any[];
    incomes: any[];
}

export function PeopleRelatedTransactions({ expenses, incomes }: PeopleRelatedTransactionsProps) {
    return (
        <Card className="h-full border-none shadow-none bg-transparent flex flex-col px-4 sm:px-6">
            <CardHeader className="px-0 pt-0 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ArrowRightLeft className="h-5 w-5 text-primary" />
                            Transaction History
                        </CardTitle>
                        <CardDescription>All financial interactions with this person</CardDescription>
                    </div>
                    <Badge variant="outline" className="w-fit bg-background mt-1">
                        Total {expenses.length + incomes.length} Records
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-0 flex-1 min-h-0 flex flex-col">
                <Tabs defaultValue="all" className="w-full h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-3 mb-4 shrink-0 bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            All Activity
                        </TabsTrigger>
                        <TabsTrigger value="expenses" className="rounded-lg data-[state=active]:text-rose-600 data-[state=active]:bg-rose-50 dark:data-[state=active]:bg-rose-950/30 dark:data-[state=active]:text-rose-400">
                            Paid To ({expenses.length})
                        </TabsTrigger>
                        <TabsTrigger value="incomes" className="rounded-lg data-[state=active]:text-emerald-600 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/30 dark:data-[state=active]:text-emerald-400">
                             Received ({incomes.length})
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="flex-1 min-h-0 mt-0">
                         <ScrollArea className="h-[350px] md:h-[450px] lg:h-[500px] rounded-md border bg-background w-full">
                            <div className="p-4">
                                {expenses.length === 0 && incomes.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    <div className="grid gap-3">
                                        {[...expenses.map(e => ({ ...e, type: 'expense' })), ...incomes.map(i => ({ ...i, type: 'income' }))]
                                        .sort((a, b) => new Date(b.ExpenseDate || b.IncomeDate).getTime() - new Date(a.ExpenseDate || a.IncomeDate).getTime())
                                        .map((item) => (
                                            <TransactionItem key={`${item.type}-${item.ExpenseID || item.IncomeID}`} item={item} />
                                        ))}
                                    </div>
                                )}
                            </div>
                         </ScrollArea>
                    </TabsContent>

                    <TabsContent value="expenses" className="flex-1 min-h-0 mt-0">
                        <ScrollArea className="h-[350px] md:h-[450px] lg:h-[500px] rounded-md border bg-background w-full">
                            <div className="p-4">
                                {expenses.length === 0 ? (
                                    <EmptyState type="expense" />
                                ) : (
                                    <div className="grid gap-3">
                                        {expenses.map((expense) => (
                                            <TransactionItem key={`expense-${expense.ExpenseID}`} item={{ ...expense, type: 'expense' }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="incomes" className="flex-1 min-h-0 mt-0">
                        <ScrollArea className="h-[350px] md:h-[450px] lg:h-[500px] rounded-md border bg-background w-full">
                            <div className="p-4">
                                {incomes.length === 0 ? (
                                    <EmptyState type="income" />
                                ) : (
                                    <div className="grid gap-3">
                                        {incomes.map((income) => (
                                            <TransactionItem key={`income-${income.IncomeID}`} item={{ ...income, type: 'income' }} />
                                        ))}
                                    </div>
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
                            {item.categories && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal flex items-center gap-1 bg-muted/50 border-transparent">
                                    <Tag className="h-3 w-3 opacity-50" />
                                    {item.categories.CategoryName}
                                </Badge>
                            )}
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
            <h3 className="text-sm font-semibold text-foreground">No Transactions Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {type === 'expense' 
                    ? "You haven't paid anything to this person yet." 
                    : type === 'income' 
                    ? "You haven't received anything from this person yet."
                    : "No financial interactions recorded with this person."}
            </p>
        </div>
    )
}
