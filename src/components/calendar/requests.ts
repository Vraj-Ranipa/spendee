import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/session'
import type { ITransaction } from '@/components/calendar/interfaces'

/** Formats a number as compact Indian Rupee: ₹1.2K, ₹3.5M, ₹2.1Cr */
function formatAmount(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1).replace(/\.0$/, '')}Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1).replace(/\.0$/, '')}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `₹${n}`;
}

export const getTransactions = async (): Promise<ITransaction[]> => {
  const session = await verifySession()
  if (!session?.userId) return []

  const userId = parseInt(session.userId as string)

  const isNormalUser = (session?.role as string)?.toUpperCase() !== 'ADMIN'

  try {
    const queryWhere = isNormalUser ? {
      OR: [
        { UserID: userId },
        { peoples: { UserID: userId } }
      ]
    } : undefined;

    const [expenses, incomes] = await Promise.all([
      prisma.expenses.findMany({
        where: queryWhere,
        include: { categories: true, users: true, peoples: true, projects: true },
      }),
      prisma.incomes.findMany({
        where: queryWhere,
        include: { categories: true, users: true, peoples: true, projects: true },
      }),
    ])

    const expenseTransactions: ITransaction[] = expenses.map(e => {
      const startDate = new Date(e.ExpenseDate);
      startDate.setHours(10, 0, 0, 0); // 10:00 AM local
      const endDate = new Date(startDate);
      endDate.setHours(11, 0, 0, 0);   // 11:00 AM local

      return {
        id: `exp-${e.ExpenseID}`,
        title: `${e.ExpenseDetail || 'Expense'}`,
        description: e.Description || e.categories?.CategoryName || 'Expense',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        color: 'red',
        user: {
          id: e.peoples?.PeopleName || e.users?.UserName || 'You',
          name: e.peoples?.PeopleName || e.users?.UserName || 'You',
          picturePath: e.users?.ProfileImage || 'https://i.pravatar.cc/150?u=' + (e.peoples?.PeopleID || e.users?.UserID || userId),
        },
        amount: Number(e.Amount),
        type: 'EXPENSE',
        categoryName: e.categories?.CategoryName,
        projectName: e.projects?.ProjectName,
      }
    })

    const incomeTransactions: ITransaction[] = incomes.map(i => {
      const startDate = new Date(i.IncomeDate);
      startDate.setHours(10, 0, 0, 0); // 10:00 AM local
      const endDate = new Date(startDate);
      endDate.setHours(11, 0, 0, 0);   // 11:00 AM local

      return {
        id: `inc-${i.IncomeID}`,
        title: `${i.IncomeDetail || 'Income'}`,
        description: i.Description || i.categories?.CategoryName || 'Income',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        color: 'green',
        user: {
          id: i.peoples?.PeopleName || i.users?.UserName || 'You',
          name: i.peoples?.PeopleName || i.users?.UserName || 'You',
          picturePath: i.users?.ProfileImage || 'https://i.pravatar.cc/150?u=' + (i.peoples?.PeopleID || i.users?.UserID || userId),
        },
        amount: Number(i.Amount),
        type: 'INCOME',
        categoryName: i.categories?.CategoryName,
        projectName: i.projects?.ProjectName,
      }
    })

    return [...expenseTransactions, ...incomeTransactions]
  } catch (error) {
    console.error("Failed to fetch transactions from Prisma:", error)
    return []
  }
}

export const getUsers = async () => {
  const session = await verifySession()
  if (!session?.userId) return []

  const userId = parseInt(session.userId as string)
  const isNormalUser = (session?.role as string)?.toUpperCase() !== 'ADMIN'

  try {
    const peoplesQuery = isNormalUser ? { UserID: userId } : undefined;

    const peoples = await prisma.peoples.findMany({
      where: peoplesQuery,
      include: { users: true }
    });

    return peoples.map(p => ({
      id: p.PeopleName,
      name: p.PeopleName,
      picturePath: p.users?.ProfileImage || 'https://i.pravatar.cc/150?u=' + p.PeopleID,
    }));
  } catch {
    return [
      {
        id: 'You',
        name: 'You',
        picturePath: 'https://i.pravatar.cc/150?u=' + userId,
      }
    ]
  }
}
