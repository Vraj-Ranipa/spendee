import { prisma } from '@/lib/prisma';
import { startOfMonth, subMonths, endOfMonth, format } from 'date-fns';

// Helper: builds a Prisma WHERE filter that matches records by UserID OR
// by PeopleID when the people record belongs to this user.
async function getUserFilter(userId?: number) {
    if (!userId) return {};

    // Find all PeopleIDs whose owner is this user
    const userPeople = await prisma.peoples.findMany({
        where: { UserID: userId },
        select: { PeopleID: true }
    });
    const peopleIds = userPeople.map(p => p.PeopleID);

    if (peopleIds.length === 0) {
        return { UserID: userId };
    }

    return {
        OR: [
            { UserID: userId },
            { PeopleID: { in: peopleIds } }
        ]
    };
}

export async function getDashboardStats(userId?: number) {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    const [whereClause, projectsWhere] = await Promise.all([
        getUserFilter(userId),
        Promise.resolve(userId ? { UserID: userId } : {})
    ]);

    // Get all incomes and expenses to calculate totals
    const [incomes, expenses, prevIncomes, prevExpenses, projects, prevProjects] = await Promise.all([
        prisma.incomes.aggregate({
            _sum: { Amount: true },
            where: { ...whereClause }
        }),
        prisma.expenses.aggregate({
            _sum: { Amount: true },
            where: { ...whereClause }
        }),
        prisma.incomes.aggregate({
            _sum: { Amount: true },
            where: { ...whereClause, IncomeDate: { gte: previousMonthStart, lte: previousMonthEnd } }
        }),
        prisma.expenses.aggregate({
            _sum: { Amount: true },
            where: { ...whereClause, ExpenseDate: { gte: previousMonthStart, lte: previousMonthEnd } }
        }),
        prisma.projects.count({
            where: { ...projectsWhere, IsActive: true }
        }),
        prisma.projects.count({
            where: { ...projectsWhere, IsActive: true, Created: { lte: previousMonthEnd } }
        }),
    ]);

    const currentIncomesTotal = await prisma.incomes.aggregate({
        _sum: { Amount: true },
        where: { ...whereClause, IncomeDate: { gte: currentMonthStart, lte: currentMonthEnd } }
    });
    const currentExpensesTotal = await prisma.expenses.aggregate({
         _sum: { Amount: true },
         where: { ...whereClause, ExpenseDate: { gte: currentMonthStart, lte: currentMonthEnd } }
    });

    const totalIncome = Number(incomes._sum.Amount || 0);
    const totalExpense = Number(expenses._sum.Amount || 0);
    const totalBalance = totalIncome - totalExpense;

    const currInc = Number(currentIncomesTotal._sum.Amount || 0);
    const prevInc = Number(prevIncomes._sum.Amount || 0);
    const incomeChange = prevInc === 0 ? 100 : ((currInc - prevInc) / prevInc) * 100;

    const currExp = Number(currentExpensesTotal._sum.Amount || 0);
    const prevExp = Number(prevExpenses._sum.Amount || 0);
    const expenseChange = prevExp === 0 ? 100 : ((currExp - prevExp) / prevExp) * 100;

    const currBal = currInc - currExp;
    const prevBal = prevInc - prevExp;
    const balanceChange = prevBal === 0 ? 100 : ((currBal - prevBal) / Math.abs(prevBal)) * 100;

    const newProjects = projects - prevProjects;

    return {
        totalBalance,
        totalIncome,
        totalExpenses: totalExpense,
        activeProjects: projects,
        balanceChange: balanceChange === Infinity ? 100 : balanceChange,
        incomeChange: incomeChange === Infinity ? 100 : incomeChange,
        expenseChange: expenseChange === Infinity ? 100 : expenseChange,
        newProjects: newProjects > 0 ? newProjects : 0,
    };
}

export async function getChartData(userId?: number) {
    const whereClause = await getUserFilter(userId);
    
    // Fallback: simplified chart data by month for the current year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    
    const incomes = await prisma.incomes.findMany({
        where: { ...whereClause, IncomeDate: { gte: startOfYear } },
        select: { Amount: true, IncomeDate: true }
    });
    
    const expenses = await prisma.expenses.findMany({
        where: { ...whereClause, ExpenseDate: { gte: startOfYear } },
        select: { Amount: true, ExpenseDate: true }
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        name: format(new Date(2024, i, 1), 'MMM'),
        income: 0,
        expense: 0,
    }));

    incomes.forEach(inc => {
        const month = inc.IncomeDate.getMonth();
        monthlyData[month].income += Number(inc.Amount);
    });

    expenses.forEach(exp => {
        const month = exp.ExpenseDate.getMonth();
        monthlyData[month].expense += Number(exp.Amount);
    });

    return monthlyData.map(d => ({
        name: d.name,
        income: d.income,
        total: d.expense // total corresponds to expense in the chart
    }));
}

export async function getRecentTransactions(userId?: number) {
    const whereClause = await getUserFilter(userId);
    
    const [incomes, expenses] = await Promise.all([
        prisma.incomes.findMany({
            where: whereClause,
            take: 5,
            orderBy: { IncomeDate: 'desc' },
            include: { categories: true, projects: true }
        }),
        prisma.expenses.findMany({
            where: whereClause,
            take: 5,
            orderBy: { ExpenseDate: 'desc' },
            include: { categories: true, projects: true }
        })
    ]);

    const transactions = [
        ...incomes.map(i => ({ ...i, type: 'income', date: i.IncomeDate })),
        ...expenses.map(e => ({ ...e, type: 'expense', date: e.ExpenseDate }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

    return transactions;
}

export async function getSpendingByCategory(userId?: number) {
    const whereClause = await getUserFilter(userId);
    
    // Fallback: This month's expenses
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const expenses = await prisma.expenses.groupBy({
        by: ['CategoryID'],
        _sum: { Amount: true },
        where: { ...whereClause, ExpenseDate: { gte: currentMonthStart, lte: currentMonthEnd } },
    });

    // Need to get category names
    const categoryIds = expenses.map(e => e.CategoryID).filter((id): id is number => id !== null);
    
    if (categoryIds.length === 0) return [];

    const categories = await prisma.categories.findMany({
        where: { CategoryID: { in: categoryIds } },
        select: { CategoryID: true, CategoryName: true }
    });

    const categoryMap = new Map(categories.map(c => [c.CategoryID, c.CategoryName]));
    
    const colors = [
        "oklch(0.51 0.23 277)", // emerald
        "oklch(0.577 0.245 27.325)", // rose
        "oklch(0.6 0.118 258.336)", // blue
        "oklch(0.648 0.2 31.396)", // orange
        "oklch(0.536 0.2 284)", // purple
        "oklch(0.7 0.1 200)", // cyan
        "oklch(0.8 0.15 100)", // yellow
    ];

    return expenses.map((e, index) => ({
        name: e.CategoryID ? categoryMap.get(e.CategoryID) || 'Unknown' : 'Uncategorized',
        value: Number(e._sum.Amount || 0),
        fill: colors[index % colors.length]
    })).filter(e => e.value > 0).sort((a, b) => b.value - a.value);
}

export async function getIncomeByCategory(userId?: number) {
    const whereClause = await getUserFilter(userId);
    
    // Fallback: This month's incomes
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const incomes = await prisma.incomes.groupBy({
        by: ['CategoryID'],
        _sum: { Amount: true },
        where: { ...whereClause, IncomeDate: { gte: currentMonthStart, lte: currentMonthEnd } },
    });

    // Need to get category names
    const categoryIds = incomes.map(i => i.CategoryID).filter((id): id is number => id !== null);
    
    if (categoryIds.length === 0) return [];

    const categories = await prisma.categories.findMany({
        where: { CategoryID: { in: categoryIds } },
        select: { CategoryID: true, CategoryName: true }
    });

    const categoryMap = new Map(categories.map(c => [c.CategoryID, c.CategoryName]));
    
    const colors = [
        "oklch(0.51 0.23 277)", // emerald
        "oklch(0.6 0.118 258.336)", // blue
        "oklch(0.7 0.1 200)", // cyan
        "oklch(0.536 0.2 284)", // purple
        "oklch(0.8 0.15 100)", // yellow
        "oklch(0.648 0.2 31.396)", // orange
        "oklch(0.577 0.245 27.325)", // rose
    ];

    return incomes.map((i, index) => ({
        name: i.CategoryID ? categoryMap.get(i.CategoryID) || 'Unknown' : 'Uncategorized',
        value: Number(i._sum.Amount || 0),
        fill: colors[index % colors.length]
    })).filter(i => i.value > 0).sort((a, b) => b.value - a.value);
}

export async function getMonthlyTrends(userId?: number) {
    const whereClause = await getUserFilter(userId);
    
    // Get last 12 months including current year
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
        const d = subMonths(now, 11 - i);
        return {
            start: startOfMonth(d),
            end: endOfMonth(d),
            name: format(d, 'MMM yyyy'),
            shortName: format(d, 'MMM')
        };
    });

    const startDate = months[0].start;
    const endDate = months[11].end;

    const incomes = await prisma.incomes.findMany({
        where: { ...whereClause, IncomeDate: { gte: startDate, lte: endDate } },
        select: { Amount: true, IncomeDate: true }
    });
    
    const expenses = await prisma.expenses.findMany({
        where: { ...whereClause, ExpenseDate: { gte: startDate, lte: endDate } },
        select: { Amount: true, ExpenseDate: true }
    });

    const trendsData = months.map(m => ({
        name: m.shortName,
        fullName: m.name,
        income: 0,
        expense: 0
    }));

    incomes.forEach(inc => {
        const monthIndex = months.findIndex(m => inc.IncomeDate >= m.start && inc.IncomeDate <= m.end);
        if (monthIndex !== -1) {
            trendsData[monthIndex].income += Number(inc.Amount);
        }
    });

    expenses.forEach(exp => {
        const monthIndex = months.findIndex(m => exp.ExpenseDate >= m.start && exp.ExpenseDate <= m.end);
        if (monthIndex !== -1) {
            trendsData[monthIndex].expense += Number(exp.Amount);
        }
    });

    return trendsData;
}

export async function getPlatformActivity() {
    // Get last 6 months
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = subMonths(now, 5 - i);
        return {
            start: startOfMonth(d),
            end: endOfMonth(d),
            name: format(d, 'MMM'),
            fullName: format(d, 'MMM yyyy')
        };
    });

    const startDate = months[0].start;
    const endDate = months[5].end;

    const [incomes, expenses] = await Promise.all([
        prisma.incomes.findMany({
            where: { IncomeDate: { gte: startDate, lte: endDate } },
            select: { IncomeDate: true }
        }),
        prisma.expenses.findMany({
            where: { ExpenseDate: { gte: startDate, lte: endDate } },
            select: { ExpenseDate: true }
        })
    ]);

    const activityData = months.map(m => ({
        name: m.name,
        fullName: m.fullName,
        incomes: 0,
        expenses: 0
    }));

    incomes.forEach(inc => {
         const monthIndex = months.findIndex(m => inc.IncomeDate >= m.start && inc.IncomeDate <= m.end);
         if (monthIndex !== -1) {
             activityData[monthIndex].incomes += 1;
         }
    });

    expenses.forEach(exp => {
         const monthIndex = months.findIndex(m => exp.ExpenseDate >= m.start && exp.ExpenseDate <= m.end);
         if (monthIndex !== -1) {
             activityData[monthIndex].expenses += 1;
         }
    });

    return activityData;
}

export async function getProjectAllocation(userId?: number) {
    const whereClause = await getUserFilter(userId);

    // Get current month's expenses by project
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const expenses = await prisma.expenses.groupBy({
        by: ['ProjectID'],
        _sum: { Amount: true },
        where: { ...whereClause, ExpenseDate: { gte: currentMonthStart, lte: currentMonthEnd }, ProjectID: { not: null } },
    });

    const projectIds = expenses.map(e => e.ProjectID).filter((id): id is number => id !== null);

    if (projectIds.length === 0) return [];

    const projects = await prisma.projects.findMany({
        where: { ProjectID: { in: projectIds } },
        select: { ProjectID: true, ProjectName: true }
    });

    const projectMap = new Map(projects.map(p => [p.ProjectID, p.ProjectName]));
    
    // Find the max amount to set a dynamic fullMark for the Radar chart
    const maxAmount = Math.max(...expenses.map(e => Number(e._sum.Amount || 0)), 100);
    // Add 20% padding to fullMark
    const fullMark = Math.ceil(maxAmount * 1.2);

    return expenses.map(e => ({
        subject: projectMap.get(e.ProjectID as number) || 'Unknown',
        amount: Number(e._sum.Amount || 0),
        fullMark: fullMark
    })).sort((a, b) => b.amount - a.amount);
}

export async function getProjectIncomeAllocation(userId?: number) {
    const whereClause = await getUserFilter(userId);

    // Get current month's incomes by project
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const incomes = await prisma.incomes.groupBy({
        by: ['ProjectID'],
        _sum: { Amount: true },
        where: { ...whereClause, IncomeDate: { gte: currentMonthStart, lte: currentMonthEnd }, ProjectID: { not: null } },
    });

    const projectIds = incomes.map(i => i.ProjectID).filter((id): id is number => id !== null);

    if (projectIds.length === 0) return [];

    const projects = await prisma.projects.findMany({
        where: { ProjectID: { in: projectIds } },
        select: { ProjectID: true, ProjectName: true }
    });

    const projectMap = new Map(projects.map(p => [p.ProjectID, p.ProjectName]));
    
    // Find the max amount to set a dynamic fullMark for the Radar chart
    const maxAmount = Math.max(...incomes.map(i => Number(i._sum.Amount || 0)), 100);
    // Add 20% padding to fullMark
    const fullMark = Math.ceil(maxAmount * 1.2);

    return incomes.map(i => ({
        subject: projectMap.get(i.ProjectID as number) || 'Unknown',
        amount: Number(i._sum.Amount || 0),
        fullMark: fullMark
    })).sort((a, b) => b.amount - a.amount);
}



export async function getStatisticalInfo(userId?: number) {
    const whereFilter = await getUserFilter(userId);
    const projectsWhere = userId ? { UserID: userId } : {};
    
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const [incomes, expenses, activeProjectsCount] = await Promise.all([
        prisma.incomes.findMany({
            where: { ...whereFilter, IncomeDate: { gte: currentMonthStart, lte: currentMonthEnd } },
            select: { Amount: true, CategoryID: true }
        }),
        prisma.expenses.findMany({
            where: { ...whereFilter, ExpenseDate: { gte: currentMonthStart, lte: currentMonthEnd } },
            select: { Amount: true, CategoryID: true }
        }),
        prisma.projects.count({
            where: { ...projectsWhere }
        })
    ]);

    const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.Amount), 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.Amount), 0);
    
    const avgIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

    const expenseCategories = new Map<number, number>();
    let highestTransaction = 0;

    expenses.forEach(e => {
        const amt = Number(e.Amount);
        if (amt > highestTransaction) highestTransaction = amt;

        if (e.CategoryID) {
            expenseCategories.set(e.CategoryID, (expenseCategories.get(e.CategoryID) || 0) + amt);
        }
    });

    incomes.forEach(i => {
        const amt = Number(i.Amount);
        if (amt > highestTransaction) highestTransaction = amt;
    })
    
    let topExpenseCategoryId = null;
    let maxExpense = 0;
    expenseCategories.forEach((amount, id) => {
        if (amount > maxExpense) {
            maxExpense = amount;
            topExpenseCategoryId = id;
        }
    });

    let topCategoryName = 'None';
    if (topExpenseCategoryId) {
        const cat = await prisma.categories.findUnique({
            where: { CategoryID: topExpenseCategoryId },
            select: { CategoryName: true }
        });
        if (cat) topCategoryName = cat.CategoryName;
    }

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const totalVolume = incomes.length + expenses.length;

    return {
        avgIncome,
        avgExpense,
        topCategoryName,
        savingsRate,
        activeProjects: activeProjectsCount,
        highestTransaction,
        totalVolume
    };
}

export async function getRecentAdditions(userId?: number) {
    const projectWhereClause = userId ? { UserID: userId } : {};
   
    const recentProjects = await prisma.projects.findMany({
        where: projectWhereClause,
        orderBy: { ProjectID: 'desc' }, // Assuming ProjectID is incrementing, acts as pseudo-createdAt if no CreatedAt exists
        take: 15,
        select: {
            ProjectID: true,
            ProjectName: true,
        }
    });

    const recentCategories = await prisma.categories.findMany({
        orderBy: { CategoryID: 'desc' },
        take: 15,
        select: {
            CategoryID: true,
            CategoryName: true,
            Description: true
        }
    });

    return {
        projects: recentProjects,
        categories: recentCategories
    };
}
