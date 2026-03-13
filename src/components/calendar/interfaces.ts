import type { TTransactionColor } from "@/components/calendar/types";

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface ITransaction {
  id: string | number;
  startDate: string;
  endDate: string;
  title: string;
  color: TTransactionColor;
  description: string;
  user: IUser;
  
  // Real prisma metadata backing the transaction
  type: "EXPENSE" | "INCOME";
  amount: number;
  categoryName?: string;
  projectName?: string;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
