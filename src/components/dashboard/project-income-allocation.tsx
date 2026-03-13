"use client"

import { Legend, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function formatRupee(value: number): string {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(2)}`;
}

interface ProjectIncomeAllocationProps {
    data: { subject: string; amount: number; fullMark: number }[];
}

export function ProjectIncomeAllocation({ data }: ProjectIncomeAllocationProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-3 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800 flex flex-col h-full">
                <CardHeader>
                    <CardTitle>Project Income</CardTitle>
                    <CardDescription>
                        Income distribution across active projects.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center text-muted-foreground">
                        <p>No project incomes found.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-3 hover:shadow-lg transition-shadow duration-200 border-zinc-200 dark:border-zinc-800 flex flex-col h-full">
            <CardHeader>
                <CardTitle>Project Income</CardTitle>
                <CardDescription>
                    Income distribution across active projects.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-col items-center justify-center w-full h-full pb-0">
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" 
                                cy="50%" 
                                innerRadius="30%" 
                                outerRadius="100%" 
                                barSize={12} 
                                data={data.map((item, index) => {
                                    const colors = [
                                        "oklch(0.51 0.23 277)", // emerald (income color first)
                                        "oklch(0.648 0.2 31.396)", // orange
                                        "oklch(0.6 0.118 258.336)", // blue
                                        "oklch(0.536 0.2 284)", // purple
                                        "oklch(0.577 0.245 27.325)", // rose
                                        "oklch(0.7 0.1 200)", // cyan
                                        "oklch(0.8 0.15 100)", // yellow
                                    ];
                                    return {
                                        ...item,
                                        fill: colors[index % colors.length]
                                    }
                                })}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <PolarAngleAxis
                                    type="number"
                                    domain={[0, 'dataMax']}
                                    angleAxisId={0}
                                    tick={false}
                                />
                                <RadialBar
                                    background={{ fill: '#f4f4f5', className: 'dark:fill-zinc-800' }}
                                    dataKey="amount"
                                    cornerRadius={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    content={({ active, payload }: any) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-xl dark:border-zinc-800">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground font-semibold">
                                                            {payload[0].payload.subject}
                                                        </span>
                                                        <span className="font-bold text-emerald-500">
                                                            {formatRupee(payload[0].value)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Custom Responsive HTML Legend */}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2 w-full">
                        {data.map((item, index) => {
                            const colors = [
                                "oklch(0.51 0.23 277)",
                                "oklch(0.648 0.2 31.396)",
                                "oklch(0.6 0.118 258.336)",
                                "oklch(0.536 0.2 284)",
                                "oklch(0.577 0.245 27.325)",
                                "oklch(0.7 0.1 200)",
                                "oklch(0.8 0.15 100)",
                            ];
                            const color = colors[index % colors.length];
                            
                            return (
                                <div key={item.subject} className="flex items-center gap-1.5">
                                    <div 
                                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                                        style={{ backgroundColor: color }}
                                    />
                                    <span 
                                        className="text-xs text-muted-foreground" 
                                        title={item.subject}
                                    >
                                        {item.subject.length > 20 
                                            ? `${item.subject.substring(0, 20)}...` 
                                            : item.subject}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
