"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { deleteImage } from "@/lib/imagekit";

export async function SaveSubCategoryAction(formData: FormData) {
    try {
        const id = formData.get("id")?.toString();
        const subCategoryId = id ? parseInt(id) : undefined;
        
        const categoryId = parseInt(formData.get("CategoryID")?.toString() || "0");
        const subCategoryName = formData.get("SubCategoryName")?.toString();
        const description = formData.get("Description")?.toString();
        const logoPath = formData.get("LogoPath")?.toString();
        const isActive = formData.get("IsActive") !== "false"; 

        const userId = parseInt(formData.get("UserID")?.toString() || "1");

        if (!subCategoryName) {
            return { success: false, message: "Sub-Category Name is required." };
        }
        if (!categoryId) {
            return { success: false, message: "Parent Category ID is required." };
        }

        const data = {
            CategoryID: categoryId,
            SubCategoryName: subCategoryName,
            Description: description,
            LogoPath: logoPath,
            IsActive: isActive,
            UserID: userId,
            Modified: new Date(),
        };

        if (subCategoryId) {
            // Find existing to cleanup old image
            const existingSubCategory = await prisma.sub_categories.findUnique({
                where: { SubCategoryID: subCategoryId }
            });

            if (existingSubCategory?.LogoPath && existingSubCategory.LogoPath !== logoPath) {
                await deleteImage(existingSubCategory.LogoPath);
            }

            // Update
            await prisma.sub_categories.update({
                where: { SubCategoryID: subCategoryId },
                data: data,
            });
            revalidatePath(`/admin/categories/${categoryId}`);
            return { success: true, message: "Sub-Category updated successfully." };
        } else {
            // Create
            await prisma.sub_categories.create({
                data: {
                    ...data,
                    Created: new Date(),
                },
            });
            revalidatePath(`/admin/categories/${categoryId}`);
            return { success: true, message: "Sub-Category created successfully." };
        }

    } catch (error) {
        console.error("Error saving sub-category:", error);
        return { success: false, message: "Failed to save sub-category." };
    }
}
