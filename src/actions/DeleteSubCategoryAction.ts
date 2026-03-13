"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteSubCategoryAction(subCategoryId: number, categoryId: number) {
    try {
        if (!subCategoryId) {
            return { success: false, message: "Sub-Category ID is required." };
        }

        const expensesCount = await prisma.expenses.count({ where: { SubCategoryID: subCategoryId } });
        const incomesCount = await prisma.incomes.count({ where: { SubCategoryID: subCategoryId } });

        if (expensesCount > 0 || incomesCount > 0) {
            return { 
                success: false, 
                message: `Cannot delete. Used in ${expensesCount} expenses and ${incomesCount} incomes.` 
            };
        }

        await prisma.sub_categories.delete({
            where: { SubCategoryID: subCategoryId },
        });

        if (categoryId) {
             revalidatePath(`/admin/categories/${categoryId}`);
        }
        return { success: true, message: "Sub-Category deleted successfully." };

    } catch (error) {
        console.error("Error deleting sub-category:", error);
        return { success: false, message: "Failed to delete sub-category." };
    }
}
