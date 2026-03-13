// Types based on Prisma Schema

export interface Category {
    CategoryID: number;
    CategoryName: string;
    LogoPath?: string | null;
    IsExpense: boolean;
    IsIncome: boolean;
}

export interface Project {
    ProjectID: number;
    ProjectName: string;
    ProjectLogo?: string | null;
}

export interface Expense {
    ExpenseID: number;
    ExpenseDate: string; // ISO Date string for serialization
    Amount: number; // Decimal in DB, number in JS
    ExpenseDetail?: string | null;
    AttachmentPath?: string | null;
    CategoryID?: number | null;
    ProjectID?: number | null;
    category?: Category;
    project?: Project;
}

export interface Income {
    IncomeID: number;
    IncomeDate: string;
    Amount: number;
    IncomeDetail?: string | null;
    AttachmentPath?: string | null;
    CategoryID?: number | null;
    ProjectID?: number | null;
    category?: Category;
    project?: Project;
}

// Unified type for UI display
export type Transaction = 
  | ({ type: 'expense' } & Expense)
  | ({ type: 'income' } & Income);

export interface DashboardStats {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    activeProjectsCount: number;
    incomeChange: number; // Percentage
    expenseChange: number; // Percentage
}
