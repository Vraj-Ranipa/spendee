
"use client";

import { Tags } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface ProjectExpenseBreakdownProps {
    expenses: any[];
}

export function ProjectExpenseBreakdown({ expenses }: ProjectExpenseBreakdownProps) {
    if (!expenses || expenses.length === 0) return null;

    const categoryTotals: Record<string, number> = {};
    let totalExpenses = 0;

    expenses.forEach(expense => {
        const categoryName = expense.categories?.CategoryName || "Uncategorized";
        const amount = Number(expense.Amount);
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount;
        totalExpenses += amount;
    });

    const sortedCategories = Object.entries(categoryTotals)
        .map(([name, amount]) => ({ name, amount, percentage: (amount / totalExpenses) * 100 }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3); 

    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Tags className="h-4 w-4 text-primary" />
                    Top Expenses
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0 px-4 pb-4">
                {sortedCategories.map((cat, index) => (
                    <div key={index} className="space-y-1 p-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-default">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium truncate max-w-[150px] group-hover:text-primary transition-colors">{cat.name}</span>
                            <span className="text-muted-foreground">{formatCurrency(cat.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Progress value={cat.percentage} className="h-1.5" />
                            <span className="text-[10px] text-muted-foreground w-8 text-right">{Math.round(cat.percentage)}%</span>
                        </div>
                    </div>
                ))}
                
                {sortedCategories.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-xs">
                        No expense data available.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
