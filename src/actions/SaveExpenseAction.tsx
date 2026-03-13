"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


import { deleteImage, uploadImage } from "@/lib/imagekit";
import { verifySession } from "@/lib/session";

export async function SaveExpenseAction(formData: FormData) {
    const id = formData.get("id");
    const ExpenseDate = formData.get("ExpenseDate") as string;
    const Amount = formData.get("Amount");
    const Description = formData.get("Description") as string;
    const ExpenseDetail = formData.get("ExpenseDetail") as string;
    let AttachmentPath = formData.get("AttachmentPath") as string;
    const UserID = formData.get("UserID");

    const CategoryID = formData.get("CategoryID");
    const SubCategoryID = formData.get("SubCategoryID");
    const PeopleID = formData.get("PeopleID");
    const ProjectID = formData.get("ProjectID");


    const session = await verifySession();
    const isUser = (session?.role as string)?.toUpperCase() === 'USER';
    const sessionUserId = session?.userId ? Number(session.userId) : undefined;

    let finalUserId = Number(UserID); // Default from form
    if (isUser && sessionUserId) {
        finalUserId = sessionUserId;
    } else if (sessionUserId && !finalUserId) {
        finalUserId = sessionUserId;
    }
    if (!finalUserId) finalUserId = 1;


    let finalPeopleId = PeopleID ? Number(PeopleID) : null;
    if (!finalPeopleId && isUser && finalUserId) {
        const userPerson = await prisma.peoples.findFirst({
            where: { UserID: finalUserId }
        });
        if (userPerson) {
            finalPeopleId = userPerson.PeopleID;
        }
    }

    const file = formData.get("file") as File | null;
    const AttachmentName = formData.get("AttachmentName") as string;

    if (file && file.size > 0 && file.name !== 'undefined') {
        try {
            // Use AttachmentName if available, else fallback to timestamped name
            const fileName = AttachmentName ? `${AttachmentName.replace(/\s+/g, '-')}-${Date.now()}` : undefined;
            const uploadResult = await uploadImage(file, fileName, "/expense-manager/expense");
            if (uploadResult && uploadResult.url) {
                AttachmentPath = uploadResult.url;
            }
        } catch (error) {
            console.error("Image Upload Failed:", error);
            // Optionally handle error, e.g. return failure or continue without image
        }
    }

    const dataPayload = {
        ExpenseDate: new Date(ExpenseDate),
        Amount: Number(Amount),
        Description: Description || null,
        ExpenseDetail: ExpenseDetail || null,
        AttachmentPath: AttachmentPath || null,
        UserID: finalUserId,

        CategoryID: CategoryID ? Number(CategoryID) : null,
        SubCategoryID: SubCategoryID ? Number(SubCategoryID) : null,
        PeopleID: finalPeopleId,
        ProjectID: ProjectID ? Number(ProjectID) : null,

        Modified: new Date()
    };

    try {
        if (id) {
            // Find existing to cleanup old image
            const existingExpense = await prisma.expenses.findUnique({
                where: { ExpenseID: Number(id) }
            });

            if (existingExpense?.AttachmentPath && existingExpense.AttachmentPath !== AttachmentPath) {
                await deleteImage(existingExpense.AttachmentPath);
            }

            await prisma.expenses.update({
                where: { ExpenseID: Number(id) },
                data: dataPayload
            });
        } else {
            await prisma.expenses.create({
                data: {
                    ...dataPayload,
                    Created: new Date()
                }
            });
        }

        revalidatePath("/expenses");
        revalidatePath("/reports");
        return { success: true, message: id ? "Expense updated successfully" : "Expense saved successfully" };

    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Failed to save expense. Please try again." };
    }
}
