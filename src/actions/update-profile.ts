'use server'

import { z } from 'zod'
import { verifySession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { uploadImage, deleteImage } from '@/lib/imagekit'

const updateProfileSchema = z.object({
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    name: z.string().min(1, 'Full Name is required'),
    description: z.string().optional(),
})

export type UpdateProfileState = {
    errors?: {
        mobile?: string[];
        username?: string[];
        name?: string[];
        description?: string[];
    };
    message?: string;
    success?: boolean;
} | undefined;

export async function updateProfile(prevState: UpdateProfileState, formData: FormData): Promise<UpdateProfileState> {
    const session = await verifySession()

    if (!session?.userId) {
        return {
            errors: {
                mobile: ['Unauthorized'],
            }
        }
    }

    const file = formData.get('file') as File | null;
    const profileImage = formData.get('profileImage') as string; // Get URL from hidden input
    const mobile = formData.get('mobile') as string;
    const username = formData.get('username') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const userId = parseInt(session.userId as string)

    const validatedFields = updateProfileSchema.safeParse({
        mobile,
        username,
        name,
        description,
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        // Check if username is taken (if changed)
        const currentUser = await prisma.users.findUnique({
            where: { UserID: userId },
            select: { UserName: true, ProfileImage: true, EmailAddress: true, UserID: true } // Select needed fields
        })

        if (!currentUser) return { errors: { mobile: ['User not found'] } }

        if (username !== currentUser.UserName) {
            const existingUser = await prisma.users.findFirst({
                where: { UserName: username }
            })
            if (existingUser) {
         
                return {
                     errors: {
                        username: ['Username is already taken. Please choose another.']
                     }
                }
            }
        }

        let finalProfileImageUrl = null;

        if (file && file.size > 0 && file.name !== 'undefined') {
            try {
                // Delete old image if exists
                if (currentUser.ProfileImage) {
                    await deleteImage(currentUser.ProfileImage);
                }

                const uploadResult = await uploadImage(file, `user-${userId}-profile-${Date.now()}`, "/expense-manager/users");
                if (uploadResult && uploadResult.url) {
                    finalProfileImageUrl = uploadResult.url;
                }
            } catch (imageError) {
                console.error("Image Upload Failed:", imageError);
            }
        }

        const userUpdateData: any = {
            UserName: username,
            MobileNo: mobile,
            Modified: new Date(),
        };
        
        if (finalProfileImageUrl) {
            userUpdateData.ProfileImage = finalProfileImageUrl;
        }

        // Update User
        const user = await prisma.users.update({
            where: { UserID: userId },
            data: userUpdateData
        })

        // Check for linked Person record
        const existingPerson = await prisma.peoples.findFirst({
            where: { UserID: userId } // Assuming UserID is the link, falling back to email if needed
        })

        const personData: any = {
            PeopleName: name,
            MobileNo: mobile,
            Description: description,
            Modified: new Date(),
        }

        if (existingPerson) {
             await prisma.peoples.update({
                where: { PeopleID: existingPerson.PeopleID },
                data: personData
            })
        } else {
             // If for some reason a Person record doesn't exist for this user, create one?
             // Or try finding by Email as fallback like in complete-profile?
             const personByEmail = await prisma.peoples.findFirst({
                where: { Email: user.EmailAddress }
             })
             
             if (personByEmail) {
                 await prisma.peoples.update({
                    where: { PeopleID: personByEmail.PeopleID },
                    data: personData
                })
             } else {
                // Determine what to do if no person record found. 
                // For now, let's create it to be safe and consistent.
                 await prisma.peoples.create({
                    data: {
                        PeopleName: name,
                        PeopleCode: `USR-${user.UserID}`,
                        Email: user.EmailAddress,
                        MobileNo: mobile,
                        Password: 'USER_LINKED_ACCOUNT',
                        Description: description || 'Linked User Account',
                        IsActive: true,
                        UserID: userId,
                        Created: new Date(),
                        Modified: new Date(),
                    }
                })
             }
        }

        revalidatePath('/profile')
        revalidatePath('/') // Revalidate dashboard/sidebar as well
        
        return {
            success: true,
            message: 'Profile updated successfully!',
        }

    } catch (error) {
        console.error("Update Profile Error:", error)
        return {
            errors: {
                mobile: ['Failed to update profile. Please try again.'],
            },
            message: 'An error occurred while updating the profile.'
        }
    }
}
