"use client";

import { useMemo } from "react";
import { CalendarX2, Clock, Text, User } from "lucide-react";
import { parseISO, format, endOfDay, startOfDay, isSameMonth, differenceInDays } from "date-fns";
import { cva } from "class-variance-authority";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { ITransaction } from "@/components/calendar/interfaces";
import type { VariantProps } from "class-variance-authority";

// --- agenda-transaction-card.tsx ---

const agendaTransactionCardVariants = cva(
  "flex select-none items-center cursor-pointer justify-between gap-3 rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      color: {
        blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600",
        green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600",
        red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600",
        yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600",
        purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600",
        orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600",
        gray: "border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600",
        "blue-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-blue-600",
        "green-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-green-600",
        "red-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-red-600",
        "orange-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-orange-600",
        "purple-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-purple-600",
        "yellow-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-yellow-600",
        "gray-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600",
      },
    },
    defaultVariants: {
      color: "blue-dot",
    },
  }
);

interface IAgendaTransactionCardProps {
  transaction: ITransaction;
  transactionCurrentDay?: number;
  transactionTotalDays?: number;
}

import { TransactionDetailPopup } from "@/components/calendar/components/transaction-detail-popup";
import { formatCompactNumber } from "@/lib/utils";

export function AgendaTransactionCard({ transaction, transactionCurrentDay, transactionTotalDays }: IAgendaTransactionCardProps) {
  const { badgeVariant } = useCalendar();

  const startDate = parseISO(transaction.startDate);
  const endDate = parseISO(transaction.endDate);

  const color = (badgeVariant === "dot" ? `${transaction.color}-dot` : transaction.color) as VariantProps<typeof agendaTransactionCardVariants>["color"];

  const agendaTransactionCardClasses = agendaTransactionCardVariants({ color });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <TransactionDetailPopup transaction={transaction}>
      <div role="button" tabIndex={0} className={agendaTransactionCardClasses} onKeyDown={handleKeyDown}>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-start gap-2">
              {["mixed", "dot"].includes(badgeVariant) && (
                <svg width="6" height="6" viewBox="0 0 8 8" className="event-dot mt-1 shrink-0">
                  <circle cx="4" cy="4" r="4" />
                </svg>
              )}

              <p className="font-semibold text-[13px] leading-tight sm:text-sm">
                {transactionCurrentDay && transactionTotalDays && (
                  <span className="mr-1 text-[11px] font-normal opacity-80">
                    Day {transactionCurrentDay} of {transactionTotalDays} •{" "}
                  </span>
                )}
                {transaction.title}
              </p>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 opacity-80">
              <User className="size-3.5 shrink-0" />
              <p className="text-xs text-foreground truncate">{transaction.user.name}</p>
            </div>

            <div className="flex items-center gap-1.5 opacity-80">
              <Clock className="size-3.5 shrink-0" />
              <p className="text-xs text-foreground truncate">
                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
              </p>
            </div>

            {transaction.description && (
              <div className="flex items-start gap-1.5 opacity-80">
                <Text className="mt-0.5 size-3.5 shrink-0" />
                <p className="text-xs text-foreground line-clamp-1">{transaction.description}</p>
              </div>
            )}
          </div>
          
          {transaction.amount ? (
            <div className={cn("shrink-0 font-bold tracking-tight text-[13px] sm:text-right sm:text-sm", transaction.type === "INCOME" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>
              ₹{formatCompactNumber(transaction.amount)}
            </div>
          ) : null}
        </div>
      </div>
    </TransactionDetailPopup>
  );
}

// --- agenda-day-group.tsx ---

interface IAgendaDayGroupProps {
  date: Date;
  transactions: ITransaction[];
  multiDayTransactions: ITransaction[];
}

export function AgendaDayGroup({ date, transactions, multiDayTransactions }: IAgendaDayGroupProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="space-y-4">
      <div className="sticky top-0 flex items-center gap-4 bg-background py-2">
        <p className="text-sm font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</p>
      </div>

      <div className="space-y-2">
        {multiDayTransactions.length > 0 &&
          multiDayTransactions.map(t => {
            const tStart = startOfDay(parseISO(t.startDate));
            const tEnd = startOfDay(parseISO(t.endDate));
            const currentDate = startOfDay(date);

            const tTotalDays = differenceInDays(tEnd, tStart) + 1;
            const tCurrentDay = differenceInDays(currentDate, tStart) + 1;
            return <AgendaTransactionCard key={t.id} transaction={t} transactionCurrentDay={tCurrentDay} transactionTotalDays={tTotalDays} />;
          })}

        {sortedTransactions.length > 0 && sortedTransactions.map(t => <AgendaTransactionCard key={t.id} transaction={t} />)}
      </div>
    </div>
  );
}

// --- calendar-agenda-view.tsx ---

interface IAgendaViewProps {
  singleDayTransactions: ITransaction[];
  multiDayTransactions: ITransaction[];
}

export function CalendarAgendaView({ singleDayTransactions, multiDayTransactions }: IAgendaViewProps) {
  const { selectedDate } = useCalendar();

  const transactionsByDay = useMemo(() => {
    const allDates = new Map<string, { date: Date; transactions: ITransaction[]; multiDayTransactions: ITransaction[] }>();

    singleDayTransactions.forEach(t => {
      const tDate = parseISO(t.startDate);
      if (!isSameMonth(tDate, selectedDate)) return;

      const dateKey = format(tDate, "yyyy-MM-dd");

      if (!allDates.has(dateKey)) {
        allDates.set(dateKey, { date: startOfDay(tDate), transactions: [], multiDayTransactions: [] });
      }

      allDates.get(dateKey)?.transactions.push(t);
    });

    multiDayTransactions.forEach(t => {
      const tStart = parseISO(t.startDate);
      const tEnd = parseISO(t.endDate);

      let currentDate = startOfDay(tStart);
      const lastDate = endOfDay(tEnd);

      while (currentDate <= lastDate) {
        if (isSameMonth(currentDate, selectedDate)) {
          const dateKey = format(currentDate, "yyyy-MM-dd");

          if (!allDates.has(dateKey)) {
            allDates.set(dateKey, { date: new Date(currentDate), transactions: [], multiDayTransactions: [] });
          }

          allDates.get(dateKey)?.multiDayTransactions.push(t);
        }
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
    });

    return Array.from(allDates.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [singleDayTransactions, multiDayTransactions, selectedDate]);

  const hasAnyTransactions = singleDayTransactions.length > 0 || multiDayTransactions.length > 0;

  return (
    <div className="h-[800px]">
      <ScrollArea className="h-full" type="always">
        <div className="space-y-6 p-4">
          {transactionsByDay.map(dayGroup => (
            <AgendaDayGroup key={format(dayGroup.date, "yyyy-MM-dd")} date={dayGroup.date} transactions={dayGroup.transactions} multiDayTransactions={dayGroup.multiDayTransactions} />
          ))}

          {!hasAnyTransactions && (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
              <CalendarX2 className="size-10" />
              <p className="text-sm md:text-base">No transactions scheduled for the selected month</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
