"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { name: "Rent", value: 1200 },
    { name: "Food", value: 900 },
    { name: "Utilities", value: 300 },
    { name: "Entertainment", value: 400 },
    { name: "Transport", value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function CategoryBreakdown() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                    Where your money is going.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip
                             content={({ active, payload }: any) => {
                                 if (active && payload && payload.length) {
                                     return (
                                         <div className="rounded-lg border bg-background p-2 shadow-sm">
                                             <span className="font-bold text-muted-foreground">{payload[0].name}: </span>
                                             <span className="font-bold">${payload[0].value}</span>
                                         </div>
                                     )
                                 }
                                 return null;
                             }}
                         />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
