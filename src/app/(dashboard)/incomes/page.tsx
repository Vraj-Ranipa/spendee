import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/serialization";
import { Income } from "./columns";
import { verifySession } from "@/lib/session";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeStats } from "@/components/incomes/income-stats";
import { columns } from "./columns";

export default async function IncomesPage() {
    const session = await verifySession();
    const isNormalUser = (session?.role as string)?.toUpperCase() !== 'ADMIN';
    const userId = session?.userId ? Number(session.userId) : undefined;

    const rawIncomes = await prisma.incomes.findMany({
        where: isNormalUser ? {
            OR: [
                { UserID: userId },
                { peoples: { UserID: userId } }
            ]
        } : undefined,
        orderBy: {
            IncomeDate: 'desc'
        },
        include: {
            categories: true,
            sub_categories: true,
            peoples: true,
            projects: true,
        }
    });

    const incomesList = serializeData(rawIncomes) as unknown as Income[];

    const totalIncome = incomesList.reduce((sum, item) => sum + item.Amount, 0);
    const incomeCount = incomesList.length;
    const averageIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;
    const highestIncome = incomesList.reduce((max, item) => Math.max(max, item.Amount), 0);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Incomes</h2>
                    <p className="text-muted-foreground">
                        Manage and track your income sources and transactions.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/incomes/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Income
                        </Link>
                    </Button>
                </div>
            </div>

            <IncomeStats
                totalIncome={totalIncome}
                incomeCount={incomeCount}
                averageIncome={averageIncome}
                highestIncome={highestIncome}
            />


            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Incomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={incomesList}
                            filterKeys={[
                                { id: "Category", title: "Category" },
                                { id: "Description", title: "Description" },
                                { id: "People", title: "People" },
                            ]}
                            initialColumnVisibility={{
                                SubCategory: false,
                                IncomeDetail: false,
                                Description: false,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}



