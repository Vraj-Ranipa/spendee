"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { deleteImage, uploadImage } from "@/lib/imagekit";

export async function SaveCategoryAction(formData: FormData) {
    try {
        const id = formData.get("id")?.toString();
        const categoryId = id ? parseInt(id) : undefined;
        
        const categoryName = formData.get("CategoryName")?.toString();
        const description = formData.get("Description")?.toString();
        
        // Handle Booleans
        const isExpense = formData.get("IsExpense") === "true";
        const isIncome = formData.get("IsIncome") === "true";
        const isActive = formData.get("IsActive") !== "false"; // Default true
        
        // Handle UserID (Mock for now or from hidden input)
        const userId = parseInt(formData.get("UserID")?.toString() || "1");

        // Handle Logo
        let logoPath = formData.get("LogoPath")?.toString();

    const file = formData.get("file") as File | null;
        if (file && file.size > 0 && file.name !== 'undefined') {
            try {
                // Use CategoryName if available, else fallback to timestamped name
                const fileName = categoryName ? `category-${categoryName.replace(/\s+/g, '-')}-${Date.now()}` : undefined;
                const uploadResult = await uploadImage(file, fileName, "/expense-manager/categories");
                if (uploadResult && uploadResult.url) {
                    logoPath = uploadResult.url;
                }
            } catch (error) {
                console.error("Image Upload Failed:", error);
            }
        }

        if (!categoryName) {
            return { success: false, message: "Category Name is required." };
        }

        const data = {
            CategoryName: categoryName,
            Description: description,
            IsExpense: isExpense,
            IsIncome: isIncome,
            IsActive: isActive,
            LogoPath: logoPath,
            UserID: userId,
            Modified: new Date(),
        };

        if (categoryId) {
            // Find existing to cleanup old image
            const existingCategory = await prisma.categories.findUnique({
                where: { CategoryID: categoryId }
            });

            if (existingCategory?.LogoPath && existingCategory.LogoPath !== logoPath) {
                await deleteImage(existingCategory.LogoPath);
            }

            // Update
            await prisma.categories.update({
                where: { CategoryID: categoryId },
                data: data,
            });
            revalidatePath("/admin/categories");
            revalidatePath(`/admin/categories/${categoryId}`);
            return { success: true, message: "Category updated successfully." };
        } else {
            // Create
            await prisma.categories.create({
                data: {
                    ...data,
                    Created: new Date(),
                },
            });
            revalidatePath("/admin/categories");
            return { success: true, message: "Category created successfully." };
        }

    } catch (error) {
        console.error("Error saving category:", error);
        return { success: false, message: "Failed to save category." };
    }
}
