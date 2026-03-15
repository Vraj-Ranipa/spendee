import { verifySession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    try {
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
    } catch (error: any) {
        // IMPORTANT: Next.js uses thrown errors internally for redirect(), notFound(), etc.
        // These must NEVER be swallowed. Check for known internal error patterns.
        const isNextjsInternalError =
            error?.digest === 'DYNAMIC_SERVER_USAGE' ||
            error?.digest?.startsWith('NEXT_') ||
            error?.message?.includes('NEXT_REDIRECT') ||
            error?.message?.includes('Dynamic server usage') ||
            // Next.js 15+ redirect() throws with this message
            error?.message?.includes('redirect');

        if (isNextjsInternalError) {
            throw error;
        }

        console.error("Dashboard Error:", error);
        return (
            <div className="p-8 space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg dark:bg-rose-950/20 dark:border-rose-900/50">
                    <h2 className="text-xl font-bold text-rose-700 dark:text-rose-400">Database Connection Error</h2>
                    <p className="text-rose-600 dark:text-rose-500">
                        Spendee is currently unable to connect to the database. This might be due to a temporary network issue or configuration error.
                    </p>
                    <pre className="mt-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded overflow-auto text-xs">
                        {error?.message || "Unknown error"}
                    </pre>
                </div>
            </div>
        );
    }
}
