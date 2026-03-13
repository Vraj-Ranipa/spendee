"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  {
    name: 'Jan',
    income: 4000,
    expense: 2400,
  },
  {
    name: 'Feb',
    income: 3000,
    expense: 1398,
  },
  {
    name: 'Mar',
    income: 2000,
    expense: 9800,
  },
  {
    name: 'Apr',
    income: 2780,
    expense: 3908,
  },
  {
    name: 'May',
    income: 1890,
    expense: 4800,
  },
  {
    name: 'Jun',
    income: 2390,
    expense: 3800,
  },
  {
    name: 'Jul',
    income: 3490,
    expense: 4300,
  },
];

export function MonthlyTrends() {
    return (
        <Card className="col-span-8">
            <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                    Income vs Expenses over time.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.4} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                             content={({ active, payload, label }: any) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                            {label}
                                        </span>
                                        <span className="font-bold text-muted-foreground">
                                            Income
                                        </span>
                                         <span className="font-bold text-emerald-500">
                                            ${payload[0].value}
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
                                            ${payload[1].value}
                                        </span>
                                        </div>
                                    </div>
                                    </div>
                                )
                                }
                                return null
                            }}
                        />
                        <Legend />
                        <Bar dataKey="income" fill="oklch(0.51 0.23 277)" radius={[4, 4, 0, 0]} name="Income" />
                        <Bar dataKey="expense" fill="oklch(0.577 0.245 27.325)" radius={[4, 4, 0, 0]} name="Expense" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
