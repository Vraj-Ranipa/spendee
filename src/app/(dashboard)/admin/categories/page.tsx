import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { categories } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/serialization";

import { CategoryGrid } from "@/components/categories/category-grid";
import { CategoriesStats } from "@/components/categories/categories-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CategoriesPage() {
    const categoriesList = await prisma.categories.findMany({
        include: {
            sub_categories: true
        },
        orderBy: {
            CategoryName: 'asc'
        }
    });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeCategories = categoriesList.filter((c: categories) => c.IsActive).length;
    const newlyAdded = categoriesList.filter((c: categories) => new Date(c.Created) >= firstDayOfMonth).length;
    const totalCategories = categoriesList.length;
    
    const totalSubCategories = categoriesList.reduce((acc, curr) => acc + curr.sub_categories.length, 0);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">
                        Manage expense and income categories.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild >
                        <Link href="/admin/categories/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Category
                        </Link>
                    </Button>
                </div>
            </div>

            <CategoriesStats
                totalCategories={totalCategories}
                totalSubCategories={totalSubCategories}
                activeCategories={activeCategories}
                newlyAdded={newlyAdded}
            />

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryGrid data={serializeData(categoriesList)} />
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}

