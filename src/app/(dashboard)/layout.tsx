import { verifySession } from '@/lib/session'
import DashboardClientLayout from './client-layout'

export default async function DashboardLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    const session = await verifySession()
    

    const prisma = require('@/lib/prisma').prisma; 
    
    let user = null;
    let userRole = 'USER';

    if (session?.userId) {
        user = await prisma.users.findUnique({
            where: { UserID: parseInt(session.userId as string) },
            select: { UserName: true, EmailAddress: true, Role: true, ProfileImage: true }
        });
        if (user) {
            userRole = user.Role;
        }
    }

    return (
        <DashboardClientLayout modal={modal} userRole={userRole} user={user}>
            {children}
        </DashboardClientLayout>
    )
}
