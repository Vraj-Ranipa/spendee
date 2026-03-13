"use client"

import { useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

function formatRupee(value: number): string {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(2)}`;
}

interface CategoryData {
    name: string;
    value: number;
    fill: string;
    [key: string]: string | number;
}

interface CategoryBreakdownProps {
    expenses: CategoryData[];
    incomes: CategoryData[];
}

export function CategoryBreakdown({ expenses, incomes }: CategoryBreakdownProps) {
    const [activeTab, setActiveTab] = useState("expenses")

    const currentData = activeTab === "expenses" ? expenses : incomes;

    return (
        <Card className="col-span-3 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                    Your transactions broken down by category for this month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="expenses" onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        <TabsTrigger value="incomes">Incomes</TabsTrigger>
                    </TabsList>
                    
                    {(!currentData || currentData.length === 0) ? (
                        <div className="flex flex-col items-center justify-center h-[220px] text-center text-muted-foreground">
                            <p>No {activeTab} found for this month.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <ScrollArea className="w-full whitespace-nowrap md:overflow-x-hidden">
                                <div className="h-[190px] min-w-[300px] md:min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                content={({ active, payload }: any) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="rounded-lg border bg-background p-2 shadow-xl dark:border-zinc-800">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.70rem] uppercase text-muted-foreground font-semibold">
                                                                        {payload[0].name}
                                                                    </span>
                                                                    <span className="font-bold" style={{ color: payload[0].payload.fill }}>
                                                                        {formatRupee(payload[0].value)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    return null
                                                }}
                                            />
                                            <Pie
                                                data={currentData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={75}
                                                paddingAngle={2}
                                                dataKey="value"
                                                animationDuration={1000}
                                                animationBegin={0}
                                            >
                                                {currentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            {/* Custom wrapping legend */}
                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 px-1 pb-1">
                                {currentData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-1.5 min-w-0">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
                                        <span className="text-[11px] text-muted-foreground truncate max-w-[120px]" title={entry.name}>{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Tabs>
            </CardContent>
        </Card>
    )
}
