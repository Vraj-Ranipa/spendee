"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

function formatRupee(value: number): string {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
}

interface OverviewProps {
    data: { name: string; total: number; income: number }[];
}

export function Overview({ data }: OverviewProps) {
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <Card className="col-span-4 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                    Compare your monthly income vs expenses.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList className="bg-zinc-100 dark:bg-zinc-900/50">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <ScrollArea className="w-full whitespace-nowrap md:overflow-x-hidden">
                            <div className="h-[250px] min-w-[600px] md:min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-zinc-800" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => formatRupee(value)}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            content={({ active, payload, label }: any) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="rounded-lg border bg-background p-2 shadow-xl dark:border-zinc-800">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                        {label}
                                                                    </span>
                                                                    <span className="font-bold text-muted-foreground">
                                                                        Income
                                                                    </span>
                                                                    <span className="font-bold text-emerald-500">
                                                                        {formatRupee(payload[1].value)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                        &nbsp;
                                                                    </span>
                                                                    <span className="font-bold text-muted-foreground">
                                                                        Expenses
                                                                    </span>
                                                                    <span className="font-bold text-rose-500">
                                                                        {formatRupee(payload[0].value)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="oklch(0.577 0.245 27.325)"
                                            radius={[4, 4, 0, 0]}
                                            className="fill-rose-500/80"
                                        />
                                        <Bar
                                            dataKey="income"
                                            fill="oklch(0.51 0.23 277)"
                                            radius={[4, 4, 0, 0]}
                                            className="fill-emerald-500"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="income" className="space-y-4">
                        <ScrollArea className="w-full whitespace-nowrap md:overflow-x-hidden">
                            <div className="h-[250px] min-w-[600px] md:min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-zinc-800" />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="income" fill="oklch(0.51 0.23 277)" radius={[4, 4, 0, 0]} className="fill-emerald-500" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="expenses" className="space-y-4">
                        <ScrollArea className="w-full whitespace-nowrap md:overflow-x-hidden">
                            <div className="h-[250px] min-w-[600px] md:min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-zinc-800" />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="total" fill="oklch(0.577 0.245 27.325)" radius={[4, 4, 0, 0]} className="fill-rose-500" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
