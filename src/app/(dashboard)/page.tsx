import { verifySession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

export default async function DashboardPage() {
    const session = await verifySession()

    let userRole = 'USER';
    let userId = null;

    if (session?.userId) {
        userId = parseInt(session.userId as string);
        const user = await prisma.users.findUnique({
            where: { UserID: userId },
            select: { Role: true }
        });
        if (user) {
            userRole = user.Role;
        }
    }

    if (userRole.toUpperCase() === 'ADMIN') {
        return <AdminDashboard />;
    }

    if (!userId) {
        return <div className="p-8">Please log in to view the dashboard.</div>;
    }

    return <UserDashboard userId={userId} />;
}
