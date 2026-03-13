"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

function formatRupee(value: number): string {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
}

interface MonthlyTrendsProps {
    data: { name: string; income: number; expense: number }[];
}

export function MonthlyTrends({ data }: MonthlyTrendsProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-4 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>
                        Income vs Expenses over the last 12 months.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-[220px] text-center text-muted-foreground">
                        <p>No trend data available.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                    Income vs Expenses over the last 12 months.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="w-full whitespace-nowrap md:overflow-x-hidden">
                    <div className="h-[220px] min-w-[600px] md:min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="oklch(0.577 0.245 27.325)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="oklch(0.577 0.245 27.325)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-zinc-800" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatRupee(value)}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#888888', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    content={({ active, payload, label }: any) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-3 shadow-xl dark:border-zinc-800">
                                                    <p className="text-[0.75rem] uppercase text-muted-foreground font-semibold mb-2">{label}</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-muted-foreground text-xs uppercase">
                                                                Income
                                                            </span>
                                                            <span className="font-bold text-emerald-500">
                                                                {formatRupee(payload[0].value)}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-muted-foreground text-xs uppercase">
                                                                Expense
                                                            </span>
                                                            <span className="font-bold text-rose-500">
                                                                {formatRupee(payload[1].value)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Legend 
                                    verticalAlign="top" 
                                    height={24}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-sm font-medium text-foreground">{value.charAt(0).toUpperCase() + value.slice(1)}</span>}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="oklch(0.51 0.23 277)"
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "oklch(0.51 0.23 277)", strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="oklch(0.577 0.245 27.325)"
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "oklch(0.577 0.245 27.325)", strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
