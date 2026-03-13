import { format } from "date-fns"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Transaction } from "@/types/dashboard"

interface RecentTransactionsProps {
    transactions: any[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    if (!transactions || transactions.length === 0) {
        return (
            <Card className="col-span-1 lg:col-span-1 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                        Latest financial activity from all sources.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-[400px]">
                        <p>No recent transactions to display.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-zinc-200 dark:border-zinc-800 flex flex-col h-full bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/80">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                            Recent Transactions
                        </CardTitle>
                        <CardDescription className="mt-1">
                            A scrollable log of your latest activity.
                        </CardDescription>
                    </div>
                    <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {transactions.length} items
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
                <ScrollArea className="h-[400px] w-full px-6 py-4">
                    <div className="space-y-4 pr-4">
                        {transactions.map((tx, i) => {
                            const isExpense = tx.type === 'expense';
                            const amount = isExpense ? tx.Amount : tx.Amount;
                            const detail = (isExpense ? tx.ExpenseDetail : tx.IncomeDetail) || "Unnamed Transaction";
                            const date = isExpense ? tx.ExpenseDate : tx.IncomeDate;
                            const categoryName = tx.categories?.CategoryName || "Uncategorized";
                            
                            return (
                                <div key={i} className="flex items-center group relative p-3 rounded-2xl hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors duration-200 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/50 cursor-default">
                                    <Avatar className="h-10 w-10 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <AvatarFallback className={isExpense 
                                            ? "bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200 dark:border-rose-800" 
                                            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}>
                                            {isExpense ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                                        <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors truncate">
                                            {detail}
                                        </p>
                                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                                            <span className="truncate max-w-[120px] font-medium">{categoryName}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 inline-block"></span>
                                            <span>{format(new Date(date), "MMM d, h:mm a")}</span>
                                        </div>
                                    </div>
                                    <div className={`ml-4 text-right font-bold text-base tracking-tight ${isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                        {isExpense ? "-" : "+"}₹{Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
                {/* Fade effect at bottom of scroll area for premium feel */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent dark:from-zinc-950 dark:to-transparent pointer-events-none rounded-b-xl" />
            </CardContent>
        </Card>
    )
}
