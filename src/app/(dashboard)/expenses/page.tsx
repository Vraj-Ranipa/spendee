import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/serialization";
import { Expense } from "./columns";
import { verifySession } from "@/lib/session";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseStats } from "@/components/expenses/expense-stats";
import { columns } from "./columns";

export default async function ExpensesPage() {
    const session = await verifySession();
    const isNormalUser = (session?.role as string)?.toUpperCase() !== 'ADMIN';
    const userId = session?.userId ? Number(session.userId) : undefined;

    const rawExpenses = await prisma.expenses.findMany({
        where: isNormalUser ? {
            OR: [
                { UserID: userId },
                { peoples: { UserID: userId } }
            ]
        } : undefined,
        orderBy: {
            ExpenseDate: 'desc'
        },
        include: {
            categories: true,
            sub_categories: true,
            peoples: true,
            projects: true,
        }
    });

    const expensesList = serializeData(rawExpenses) as unknown as Expense[];

    const totalExpense = expensesList.reduce((sum, item) => sum + item.Amount, 0);
    const expenseCount = expensesList.length;
    const averageExpense = expenseCount > 0 ? totalExpense / expenseCount : 0;
    const highestExpense = expensesList.reduce((max, item) => Math.max(max, item.Amount), 0);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
                    <p className="text-muted-foreground">
                        Manage and track your expense records and transactions.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/expenses/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Expense
                        </Link>
                    </Button>
                </div>
            </div>

            <ExpenseStats
                totalExpense={totalExpense}
                expenseCount={expenseCount}
                averageExpense={averageExpense}
                highestExpense={highestExpense}
            />

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={expensesList}
                            filterKeys={[
                                { id: "Category", title: "Category" },
                                { id: "Description", title: "Description" },
                                { id: "People", title: "People" },
                            ]}
                            initialColumnVisibility={{
                                SubCategory: false,
                                ExpenseDetail: false,
                                Description: false,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
