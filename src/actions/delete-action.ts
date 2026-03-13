'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/imagekit";

export async function deleteRow(
  model: string,
  id: string,
  path?: string
) {
    const modelKeyMap: Record<string, string> = {
        expenses: "ExpenseID",
        incomes: "IncomeID",
        projects: "ProjectID",
        categories: "CategoryID",
        sub_categories: "SubCategoryID",
        peoples: "PeopleID",
        users: "UserID"
    };

    const pkField = modelKeyMap[model] || "id";
    
    const numericId = Number(id);
    const idValue = (modelKeyMap[model] && !isNaN(numericId)) ? numericId : id;

    // @ts-ignore - Dynamic access to prisma client
    const prismaModel = prisma[model];

    if (!prismaModel) {
        throw new Error(`Invalid model name: ${model}`);
    }

    // Validation checks for dependencies
    if (model === 'categories') {
        const catId = idValue as number;
        const expensesCount = await prisma.expenses.count({ where: { CategoryID: catId } });
        const incomesCount = await prisma.incomes.count({ where: { CategoryID: catId } });
        const subCategoriesCount = await prisma.sub_categories.count({ where: { CategoryID: catId } });

        if (expensesCount > 0 || incomesCount > 0 || subCategoriesCount > 0) {
            throw new Error(`Cannot delete category. Used in ${expensesCount} expenses, ${incomesCount} incomes, and has ${subCategoriesCount} sub-categories.`);
        }
    }

    if (model === 'sub_categories') {
        const subCatId = idValue as number;
        const expensesCount = await prisma.expenses.count({ where: { SubCategoryID: subCatId } });
        const incomesCount = await prisma.incomes.count({ where: { SubCategoryID: subCatId } });

        if (expensesCount > 0 || incomesCount > 0) {
            throw new Error(`Cannot delete sub-category. Used in ${expensesCount} expenses and ${incomesCount} incomes.`);
        }
    }

    // Image Cleanup Logic
    try {
        const record = await prismaModel.findUnique({
            where: { [pkField]: idValue }
        });

        if (record) {
             // Handle AttachmentPath (Incomes/Expenses)
            if (record.AttachmentPath && record.AttachmentPath.includes("imagekit.io")) {
                await deleteImage(record.AttachmentPath);
            }
            // Handle LogoPath (Projects/Categories/SubCategories)
             if (record.LogoPath && record.LogoPath.includes("imagekit.io")) {
                await deleteImage(record.LogoPath);
            }
             // Handle ProjectLogo (Projects - older naming if any)
            if (record.ProjectLogo && record.ProjectLogo.includes("imagekit.io")) {
                 await deleteImage(record.ProjectLogo);
            }
        }
    } catch (error) {
        console.error("Error cleaning up image:", error);
        // Continue with deletion even if image cleanup fails, or maybe throw? 
        // Typically better to warn but allow DB cleanup.
    }

    await prismaModel.delete({
      where: { [pkField]: idValue },
    });

    if (path) {
      revalidatePath(path);
    }
    if (model === 'expenses' || model === 'incomes') {
      revalidatePath('/reports');
    }
}
