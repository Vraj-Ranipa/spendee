'use server'

import { z } from 'zod'
import { verifySession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { uploadImage, deleteImage } from '@/lib/imagekit'

const completeProfileSchema = z.object({
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    name: z.string().min(1, 'Full Name is required'),
    description: z.string().optional(),

})

export type CompleteProfileState = {
    errors?: {
        mobile?: string[];
        name?: string[];
        description?: string[];
    };
    message?: string;
} | undefined;

export async function completeProfile(prevState: CompleteProfileState, formData: FormData): Promise<CompleteProfileState> {
    const session = await verifySession()

    if (!session?.userId) {
        return {
            errors: {
                mobile: ['Unauthorized'],
            }
        }
    }

    if (formData.get('intent') === 'skip') {
         redirect('/')
    }

    const file = formData.get('file') as File | null;
    const mobile = formData.get('mobile') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const userId = parseInt(session.userId as string)

    if (!mobile || mobile.length < 10) {
        return { errors: { mobile: ['Mobile number must be at least 10 digits'] } }
    }
    
    if (!name) {
         return { errors: { name: ['Full Name is required'] } }
    }

    try {
        let profileImageUrl = null;

        if (file && file.size > 0 && file.name !== 'undefined') {
            try {
                // Fetch current user to check for existing image
                const currentUser = await prisma.users.findUnique({
                    where: { UserID: userId },
                    select: { ProfileImage: true }
                });

                if (currentUser?.ProfileImage) {
                    await deleteImage(currentUser.ProfileImage);
                }

                const uploadResult = await uploadImage(file, `user-${userId}-profile-${Date.now()}`, "/expense-manager/users");
                if (uploadResult && uploadResult.url) {
                    profileImageUrl = uploadResult.url;
                }
            } catch (imageError) {
                console.error("Image Upload Failed:", imageError);
            }
        }

        const updateData: any = {
            MobileNo: mobile,
        };
        if (profileImageUrl) {
            updateData.ProfileImage = profileImageUrl;
        }

        const user = await prisma.users.update({
            where: { UserID: userId },
            data: updateData
        })

        const existingPerson = await prisma.peoples.findFirst({
            where: { Email: user.EmailAddress }
        })

        if (!existingPerson) {
            await prisma.peoples.create({
                data: {
                    PeopleName: name, // Use Real Name from form
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
        } else {
            // Update Existing Person
            await prisma.peoples.update({
                where: { PeopleID: existingPerson.PeopleID },
                data: {
                    PeopleName: name, // Update Real Name
                    MobileNo: mobile,
                    Description: description || existingPerson.Description,
                    Modified: new Date()
                }
            })
        }

    } catch (error) {
        console.error("Complete Profile Error:", error)
        return {
            errors: {
                mobile: ['Failed to update profile. Please try again.'],
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
