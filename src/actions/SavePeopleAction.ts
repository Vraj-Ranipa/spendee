'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/session";

export async function SavePeopleAction(formData: FormData) {
    const session = await verifySession();
    const userId = session?.userId ? parseInt(session.userId as string) : 1; // Fallback to 1 for dev/test

    const id = formData.get("id");
    const PeopleName = formData.get("PeopleName") as string;
    const PeopleCode = formData.get("PeopleCode") as string;
    const Email = formData.get("Email") as string;
    const MobileNo = formData.get("MobileNo") as string;
    const Password = formData.get("Password") as string;
    const Description = formData.get("Description") as string;
    const IsActive = formData.get("IsActive") === "true";

    if (!PeopleName) {
        return { success: false, message: "Name is required" };
    }

    try {
        const payload: any = {
            PeopleName,
            PeopleCode,
            Email,
            MobileNo,
            Description,
            IsActive,
            UserID: userId,
            Modified: new Date(),
        };

        // Only update password if provided (for edits) or if new record
        if (Password) {
            payload.Password = Password;
        }

        if (id && id !== "") {
            // Update
            await prisma.peoples.update({
                where: { PeopleID: Number(id) },
                data: payload
            });
            revalidatePath("/admin/people");
            return { success: true, message: "Person updated successfully" };
        } else {
            // Create
            // Ensure password is present for new records if required by DB, though schema allows simple string
            // We'll trust the form validator for required fields or DB constraint
            if (!payload.Password) {
                // Fallback or error if password is strictly required. 
                // Schema says Password String @db.VarChar(50), not nullable.
                // So we must provide it.
                if (!Password) return { success: false, message: "Password is required for new users." };
            }

            payload.Created = new Date();
            await prisma.peoples.create({
                data: payload
            });
            revalidatePath("/admin/people");
            return { success: true, message: "Person created successfully" };
        }

    } catch (error) {
        console.error("SavePeopleAction Error:", error);
        return { success: false, message: "Failed to save person" };
    }
}
