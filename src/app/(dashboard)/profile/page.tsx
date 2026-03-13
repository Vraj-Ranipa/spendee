import { verifySession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileView } from "@/components/profile/profile-view"
import { serializeData } from "@/lib/serialization"

export default async function ProfilePage() {
    const session = await verifySession()

    if (!session?.userId) {
        redirect("/login")
    }

    const userId = parseInt(session.userId as string)

    const user = await prisma.users.findUnique({
        where: { UserID: userId }
    })

    if (!user) {
        redirect("/login")
    }

    const person = await prisma.peoples.findFirst({
        where: { UserID: userId }
    })

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
             <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
            </div>

            <ProfileView user={serializeData(user)} person={serializeData(person)} />
        </div>
    )
}
