import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Layers, PieChart, Briefcase, Trophy, Activity } from "lucide-react"

interface StatisticalInfoProps {
    data: {
        avgIncome: number;
        avgExpense: number;
        topCategoryName: string;
        savingsRate: number;
        activeProjects: number;
        highestTransaction: number;
        totalVolume: number;
    }
}

export function StatisticalInfo({ data }: StatisticalInfoProps) {
    return (
        <Card className="col-span-4 md:col-span-8 hover:shadow-lg transition-all duration-200 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Statistical Insights</CardTitle>
                <CardDescription>
                    Key metrics and averages for the current month.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 overflow-hidden">
                
                <div className="flex flex-col p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 justify-between min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 min-w-0">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300 truncate">Avg Income</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-400 block truncate" title={`₹${data.avgIncome.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}>
                            ₹{data.avgIncome.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5 sm:mt-1 truncate">Per transaction</p>
                    </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30 justify-between min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 min-w-0">
                        <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-rose-800 dark:text-rose-300 truncate">Avg Expense</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-rose-700 dark:text-rose-400 block truncate" title={`₹${data.avgExpense.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}>
                            ₹{data.avgExpense.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-rose-600/70 dark:text-rose-400/70 mt-0.5 sm:mt-1 truncate">Per transaction</p>
                    </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30 justify-between min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 min-w-0">
                        <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300 truncate">Top Spend</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-amber-700 dark:text-amber-400 block truncate" title={data.topCategoryName}>
                            {data.topCategoryName}
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-0.5 sm:mt-1 truncate">Highest total volume</p>
                    </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 justify-between min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 min-w-0">
                        <PieChart className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-indigo-800 dark:text-indigo-300 truncate">Net Savings</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 dark:text-indigo-400 block truncate" title={`${data.savingsRate.toFixed(1)}%`}>
                            {data.savingsRate.toFixed(1)}%
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-indigo-600/70 dark:text-indigo-400/70 mt-0.5 sm:mt-1 truncate">Income vs Expense</p>
                    </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 justify-between min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 min-w-0">
                        <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 truncate">Projects</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 block truncate" title={data.activeProjects.toString()}>
                            {data.activeProjects}
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-0.5 sm:mt-1 truncate">Total active</p>
                    </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30 justify-between min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 min-w-0">
                        <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-300 truncate">Highest Tx</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400 block truncate" title={`₹${data.highestTransaction.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}>
                            ₹{data.highestTransaction.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-purple-600/70 dark:text-purple-400/70 mt-0.5 sm:mt-1 truncate">Single transaction</p>
                    </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-100 dark:border-teal-900/30 justify-between min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 min-w-0">
                        <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-teal-800 dark:text-teal-300 truncate">Tx Volume</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-teal-700 dark:text-teal-400 block truncate" title={data.totalVolume.toString()}>
                            {data.totalVolume}
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-teal-600/70 dark:text-teal-400/70 mt-0.5 sm:mt-1 truncate">Items this month</p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
