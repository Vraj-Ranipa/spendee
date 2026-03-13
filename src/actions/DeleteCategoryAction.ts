"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteCategoryAction(categoryId: number) {
    try {
        if (!categoryId) {
            return { success: false, message: "Category ID is required." };
        }

        // Check for dependencies (optional, depending on requirements)
        // For now, we rely on FK constraints or cascading if set, but schema says NoAction for delete.
        // So we should check manually.
        const expensesCount = await prisma.expenses.count({ where: { CategoryID: categoryId } });
        const incomesCount = await prisma.incomes.count({ where: { CategoryID: categoryId } });
        const subCategoriesCount = await prisma.sub_categories.count({ where: { CategoryID: categoryId } });

        if (expensesCount > 0 || incomesCount > 0 || subCategoriesCount > 0) {
            return { 
                success: false, 
                message: `Cannot delete category. It is used in ${expensesCount} expenses, ${incomesCount} incomes, and has ${subCategoriesCount} sub-categories.` 
            };
        }

        await prisma.categories.delete({
            where: { CategoryID: categoryId },
        });

        revalidatePath("/admin/categories");
        return { success: true, message: "Category deleted successfully." };

    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, message: "Failed to delete category." };
    }
}
