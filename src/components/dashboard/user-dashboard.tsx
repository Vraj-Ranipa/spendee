import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { MonthlyTrends } from "@/components/dashboard/monthly-trends";
import { ProjectAllocation } from "@/components/dashboard/project-allocation";
import { RecentAdditions } from "@/components/dashboard/recent-additions";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
    getDashboardStats, 
    getChartData, 
    getRecentTransactions,
    getSpendingByCategory,
    getIncomeByCategory,
    getMonthlyTrends,
    getProjectAllocation,
    getRecentAdditions
} from "@/lib/dashboard-data";

export async function UserDashboard({ userId }: { userId: number }) {
    // User dashboard fetches personal statistics
    const [stats, chartData, recentTransactions, spendingByCategory, incomeByCategory, monthlyTrends, projectAlloc, recentAdditions] = await Promise.all([
        getDashboardStats(userId),
        getChartData(userId),
        getRecentTransactions(userId),
        getSpendingByCategory(userId),
        getIncomeByCategory(userId),
        getMonthlyTrends(userId),
        getProjectAllocation(userId),
        getRecentAdditions(userId)
    ]);

    return (
        <div className="flex-1 space-y-4 px-3 py-6 md:px-4 md:py-6 md:pt-6 animate-in fade-in duration-500 overflow-x-hidden">
            <div className="flex items-center justify-between space-y-2 px-1 md:px-0">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    My Overview
                </h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>
            
            <StatsCards data={stats} />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Overview data={chartData} />
                <CategoryBreakdown expenses={spendingByCategory} incomes={incomeByCategory} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <MonthlyTrends data={monthlyTrends} />
                <ProjectAllocation data={projectAlloc} />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 border-none">
                <div className="lg:col-span-2">
                    <RecentTransactions transactions={recentTransactions} />
                </div>
                <div className="lg:col-span-1">
                    <RecentAdditions data={recentAdditions} />
                </div>
            </div>
        </div>
    );
}
