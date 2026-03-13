"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminUserGrowthProps {
    data: { name: string; users: number }[];
}

export function AdminUserGrowth({ data }: AdminUserGrowthProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-4 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Platform Growth</CardTitle>
                    <CardDescription>
                        New user registrations over the last 6 months.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-[220px] text-center text-muted-foreground">
                        <p>No user registration data available.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>
                    New user registrations over the last 6 months.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.6 0.118 258.336)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="oklch(0.6 0.118 258.336)" stopOpacity={0}/>
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
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ stroke: '#888888', strokeWidth: 1, strokeDasharray: '3 3' }}
                                content={({ active, payload, label }: any) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-3 shadow-xl dark:border-zinc-800">
                                                <p className="text-[0.75rem] uppercase text-muted-foreground font-semibold mb-2">{label}</p>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-muted-foreground text-xs uppercase">
                                                        New Users
                                                    </span>
                                                    <span className="font-bold text-blue-500">
                                                        {payload[0].value} registered
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="oklch(0.6 0.118 258.336)"
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
