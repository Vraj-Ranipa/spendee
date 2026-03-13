"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { format, differenceInMinutes, parseISO, isWithinInterval, differenceInDays, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isBefore, isAfter } from "date-fns";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { DraggableEvent } from "@/components/calendar/components/dnd/draggable-event";
import { MonthTransactionBadge } from "@/components/calendar/components/month-view/calendar-month-view";
import { cn } from "@/lib/utils";

import type { HTMLAttributes } from "react";
import type { ITransaction } from "@/components/calendar/interfaces";
import type { VariantProps } from "class-variance-authority";

// --- transaction-block.tsx ---

const calendarWeekTransactionCardVariants = cva(
  "flex select-none flex-col gap-0.5 cursor-pointer overflow-hidden rounded-md border px-1.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      color: {
        blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600",
        green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600",
        red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600",
        yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600",
        purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600",
        orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600",
        gray: "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600",
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

interface ITransactionBlockProps extends HTMLAttributes<HTMLDivElement>, Omit<VariantProps<typeof calendarWeekTransactionCardVariants>, "color"> {
  transaction: ITransaction;
  hasNavigation?: boolean;
}

import { TransactionDetailPopup } from "@/components/calendar/components/transaction-detail-popup";
import { formatCompactNumber } from "@/lib/utils";

export function TransactionBlock({ transaction, className, hasNavigation }: ITransactionBlockProps) {
  const { badgeVariant } = useCalendar();

  const start = parseISO(transaction.startDate);
  const end = parseISO(transaction.endDate);
  const durationInMinutes = differenceInMinutes(end, start);
  const heightInPixels = (durationInMinutes / 60) * 96 - 8;

  const color = (badgeVariant === "dot" ? `${transaction.color}-dot` : transaction.color) as VariantProps<typeof calendarWeekTransactionCardVariants>["color"];

  const calendarWeekTransactionCardClasses = cn(
    calendarWeekTransactionCardVariants({ color, className }), 
    durationInMinutes < 35 && "flex-row items-center py-0",
    hasNavigation && "px-6"
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <DraggableEvent transaction={transaction}>
      <TransactionDetailPopup transaction={transaction}>
        <div role="button" tabIndex={0} className={calendarWeekTransactionCardClasses} style={{ height: `${heightInPixels}px` }} onKeyDown={handleKeyDown}>
          <div className="flex w-full items-start justify-between gap-1 overflow-hidden">
            <div className="flex min-w-0 items-center gap-1.5">
              {["mixed", "dot"].includes(badgeVariant) && (
                <svg width="6" height="6" viewBox="0 0 8 8" className="event-dot mt-0.5 shrink-0">
                  <circle cx="4" cy="4" r="4" />
                </svg>
              )}

              <p className="truncate font-semibold text-[11px] leading-tight">{transaction.title}</p>
            </div>
            
            {transaction.amount ? (
              <span className={cn("shrink-0 text-[10px] font-bold tracking-tight", transaction.type === "INCOME" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>
                ₹{formatCompactNumber(transaction.amount)}
              </span>
            ) : null}
          </div>

          {durationInMinutes > 25 && (
            <p className="truncate text-[10px] leading-tight opacity-75">
              {format(start, "h:mm a")} - {format(end, "h:mm a")}
            </p>
          )}
        </div>
      </TransactionDetailPopup>
    </DraggableEvent>
  );
}

// --- transaction-scroll-container.tsx ---

const AUTO_SCROLL_MS = 3500;

interface PageControlProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function TransactionPageControls({ totalPages, currentPage, onPageChange }: PageControlProps) {
  useEffect(() => {
    if (totalPages <= 1) return;
    const id = setInterval(() => {
      onPageChange((currentPage + 1) % totalPages);
    }, AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [totalPages, currentPage, onPageChange]);

  return null;
}

export function TransactionBlockNav({
  totalPages,
  currentPage,
  onPageChange,
  showPrev = true,
  showNext = true,
  totalTransactions,
  perPage = 1,
}: PageControlProps & { showPrev?: boolean; showNext?: boolean; totalTransactions: number; perPage?: number }) {
  if (totalPages <= 1) return null;

  const lastVisible = Math.min((currentPage + 1) * perPage, totalTransactions);

  return (
    <>
      {showPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPageChange(Math.max(0, currentPage - 1)); }}
          disabled={currentPage === 0}
          className={cn(
            "absolute left-0 top-1/2 z-20 -translate-y-1/2 flex size-5 items-center justify-center rounded-r-md bg-background/90 border-r border-y border-border shadow hover:bg-accent transition-opacity",
            currentPage === 0 && "opacity-30 pointer-events-none"
          )}
          aria-label="Previous transaction"
        >
          <ChevronLeft className="size-3" />
        </button>
      )}

      {showNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onPageChange(Math.min(totalPages - 1, currentPage + 1)); }}
          disabled={currentPage >= totalPages - 1}
          className={cn(
            "absolute right-0 top-1/2 z-20 -translate-y-1/2 flex size-5 items-center justify-center rounded-l-md bg-background/90 border-l border-y border-border shadow hover:bg-accent transition-opacity",
            currentPage >= totalPages - 1 && "opacity-30 pointer-events-none"
          )}
          aria-label="Next transaction"
        >
          <ChevronRight className="size-3" />
        </button>
      )}

      {showNext && (
        <span className="absolute bottom-1.5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-background/90 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground border border-border shadow-sm pointer-events-none backdrop-blur-md">
          {lastVisible}/{totalTransactions}
        </span>
      )}
    </>
  );
}

export const TRANSACTIONS_PER_PAGE = 1;

export function getVisibleGroups<T>(groups: T[], page: number, perPage = TRANSACTIONS_PER_PAGE): T[] {
  return groups.slice(page * perPage, (page + 1) * perPage);
}

export function getTotalPages(groupCount: number, perPage = TRANSACTIONS_PER_PAGE): number {
  return Math.ceil(groupCount / perPage);
}

export function useTransactionPage(groupCount: number, perPage = TRANSACTIONS_PER_PAGE) {
  const [page, setPage] = useState(0);
  const totalPages = getTotalPages(groupCount, perPage);

  useEffect(() => {
    setPage(0);
  }, [groupCount]);

  const goTo = useCallback(
    (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1))),
    [totalPages]
  );

  return { page, setPage: goTo, totalPages };
}

// --- calendar-time-line.tsx ---

interface ITimelineProps {
  firstVisibleHour: number;
  lastVisibleHour: number;
}

export function CalendarTimeline({ firstVisibleHour, lastVisibleHour }: ITimelineProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const visibleStartMinutes = firstVisibleHour * 60;
    const visibleEndMinutes = lastVisibleHour * 60;
    const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;

    return ((minutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
  };

  const formatCurrentTime = () => {
    return format(currentTime, "h:mm a");
  };

  const currentHour = currentTime.getHours();
  if (currentHour < firstVisibleHour || currentHour >= lastVisibleHour) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 z-50 border-t border-primary" style={{ top: `${getCurrentTimePosition()}%` }}>
      <div className="absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"></div>
      <div className="absolute -left-18 flex w-16 -translate-y-1/2 justify-end bg-background pr-1 text-xs font-medium text-primary">{formatCurrentTime()}</div>
    </div>
  );
}

// --- day-view-multi-day-transactions-row.tsx ---

interface IDayMultiDayProps {
  selectedDate: Date;
  multiDayTransactions: ITransaction[];
}

export function DayViewMultiDayTransactionsRow({ selectedDate, multiDayTransactions }: IDayMultiDayProps) {
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);

  const multiDayTransactionsInDay = multiDayTransactions
    .filter(t => {
      const tStart = parseISO(t.startDate);
      const tEnd = parseISO(t.endDate);

      const isOverlapping =
        isWithinInterval(dayStart, { start: tStart, end: tEnd }) ||
        isWithinInterval(dayEnd, { start: tStart, end: tEnd }) ||
        (tStart <= dayStart && tEnd >= dayEnd);

      return isOverlapping;
    })
    .sort((a, b) => {
      const durationA = differenceInDays(parseISO(a.endDate), parseISO(a.startDate));
      const durationB = differenceInDays(parseISO(b.endDate), parseISO(b.startDate));
      return durationB - durationA;
    });

  if (multiDayTransactionsInDay.length === 0) return null;

  return (
    <div className="flex border-b">
      <div className="w-18"></div>
      <div className="flex flex-1 flex-col gap-1 border-l py-1">
        {multiDayTransactionsInDay.map(t => {
          const tStart = startOfDay(parseISO(t.startDate));
          const tEnd = startOfDay(parseISO(t.endDate));
          const currentDate = startOfDay(selectedDate);

          const tTotalDays = differenceInDays(tEnd, tStart) + 1;
          const tCurrentDay = differenceInDays(currentDate, tStart) + 1;

          return <MonthTransactionBadge key={t.id} transaction={t} cellDate={selectedDate} transactionCurrentDay={tCurrentDay} transactionTotalDays={tTotalDays} />;
        })}
      </div>
    </div>
  );
}

// --- week-view-multi-day-transactions-row.tsx ---

interface IWeekMultiDayProps {
  selectedDate: Date;
  multiDayTransactions: ITransaction[];
}

export function WeekViewMultiDayTransactionsRow({ selectedDate, multiDayTransactions }: IWeekMultiDayProps) {
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const processedTransactions = useMemo(() => {
    return multiDayTransactions
      .map(t => {
        const start = parseISO(t.startDate);
        const end = parseISO(t.endDate);
        const adjustedStart = isBefore(start, weekStart) ? weekStart : start;
        const adjustedEnd = isAfter(end, weekEnd) ? weekEnd : end;
        const startIndex = differenceInDays(adjustedStart, weekStart);
        const endIndex = differenceInDays(adjustedEnd, weekStart);

        return {
          ...t,
          adjustedStart,
          adjustedEnd,
          startIndex,
          endIndex,
        };
      })
      .sort((a, b) => {
        const startDiff = a.adjustedStart.getTime() - b.adjustedStart.getTime();
        if (startDiff !== 0) return startDiff;
        return b.endIndex - b.startIndex - (a.endIndex - a.startIndex);
      });
  }, [multiDayTransactions, weekStart, weekEnd]);

  const transactionRows = useMemo(() => {
    const rows: (typeof processedTransactions)[] = [];

    processedTransactions.forEach(t => {
      let rowIndex = rows.findIndex(row => row.every(e => e.endIndex < t.startIndex || e.startIndex > t.endIndex));

      if (rowIndex === -1) {
        rowIndex = rows.length;
        rows.push([]);
      }

      rows[rowIndex].push(t);
    });

    return rows;
  }, [processedTransactions]);

  const hasTransactionsInWeek = useMemo(() => {
    return multiDayTransactions.some(t => {
      const start = parseISO(t.startDate);
      const end = parseISO(t.endDate);

      return (
        (start >= weekStart && start <= weekEnd) ||
        (end >= weekStart && end <= weekEnd) ||
        (start <= weekStart && end >= weekEnd)
      );
    });
  }, [multiDayTransactions, weekStart, weekEnd]);

  if (!hasTransactionsInWeek) {
    return null;
  }

  return (
    <div className="hidden overflow-hidden sm:flex">
      <div className="w-18 border-b"></div>
      <div className="grid flex-1 grid-cols-7 divide-x border-b border-l">
        {weekDays.map((day, dayIndex) => (
          <div key={day.toISOString()} className="flex h-full flex-col gap-1 py-1">
            {transactionRows.map((row, rowIndex) => {
              const t = row.find(e => e.startIndex <= dayIndex && e.endIndex >= dayIndex);

              if (!t) {
                return <div key={`${rowIndex}-${dayIndex}`} className="h-6.5" />;
              }

              let position: "first" | "middle" | "last" | "none" = "none";

              if (dayIndex === t.startIndex && dayIndex === t.endIndex) {
                position = "none";
              } else if (dayIndex === t.startIndex) {
                position = "first";
              } else if (dayIndex === t.endIndex) {
                position = "last";
              } else {
                position = "middle";
              }

              return <MonthTransactionBadge key={`${t.id}-${dayIndex}`} transaction={t} cellDate={startOfDay(day)} position={position} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
