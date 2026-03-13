import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { isToday, startOfDay, endOfDay, format, isSameDay, parseISO } from "date-fns";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import { DroppableDayCell } from "@/components/calendar/components/dnd/droppable-day-cell";
import { DraggableEvent } from "@/components/calendar/components/dnd/draggable-event";

import { cn } from "@/lib/utils";
import { getCalendarCells, calculateMonthTransactionPositions, getMonthCellTransactions } from "@/components/calendar/helpers";

import type { ITransaction, ICalendarCell } from "@/components/calendar/interfaces";
import type { TTransactionColor } from "@/components/calendar/types";

const transactionBulletVariants = cva("size-2 rounded-full", {
  variants: {
    color: {
      blue: "bg-blue-600 dark:bg-blue-500",
      green: "bg-green-600 dark:bg-green-500",
      red: "bg-red-600 dark:bg-red-500",
      yellow: "bg-yellow-600 dark:bg-yellow-500",
      purple: "bg-purple-600 dark:bg-purple-500",
      gray: "bg-neutral-600 dark:bg-neutral-500",
      orange: "bg-orange-600 dark:bg-orange-500",
    },
  },
  defaultVariants: {
    color: "blue",
  },
});

export function TransactionBullet({ color, className }: { color: TTransactionColor; className?: string }) {
  return <div className={cn(transactionBulletVariants({ color, className }))} />;
}

const transactionBadgeVariants = cva(
  "mx-1 flex size-auto h-6.5 cursor-pointer select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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
        "yellow-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-yellow-600",
        "purple-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-purple-600",
        "orange-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-orange-600",
        "gray-dot": "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600",
      },
      multiDayPosition: {
        first: "relative z-10 mr-0 w-[calc(100%_-_3px)] rounded-r-none border-r-0 [&>span]:mr-2.5",
        middle: "relative z-10 mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0",
        last: "ml-0 rounded-l-none border-l-0",
        none: "",
      },
    },
    defaultVariants: {
      color: "blue-dot",
    },
  }
);

interface IMonthTransactionBadgeProps extends Omit<VariantProps<typeof transactionBadgeVariants>, "color" | "multiDayPosition"> {
  transaction: ITransaction;
  cellDate: Date;
  transactionCurrentDay?: number;
  transactionTotalDays?: number;
  className?: string;
  position?: "first" | "middle" | "last" | "none";
}

import { TransactionDetailPopup } from "@/components/calendar/components/transaction-detail-popup";
import { formatCompactNumber } from "@/lib/utils";

export function MonthTransactionBadge({ transaction, cellDate, transactionCurrentDay, transactionTotalDays, className, position: propPosition }: IMonthTransactionBadgeProps) {
  const { badgeVariant } = useCalendar();

  const itemStart = startOfDay(parseISO(transaction.startDate));
  const itemEnd = endOfDay(parseISO(transaction.endDate));

  if (cellDate < itemStart || cellDate > itemEnd) return null;

  let position: "first" | "middle" | "last" | "none" | undefined;

  if (propPosition) {
    position = propPosition;
  } else if (transactionCurrentDay && transactionTotalDays) {
    position = "none";
  } else if (isSameDay(itemStart, itemEnd)) {
    position = "none";
  } else if (isSameDay(cellDate, itemStart)) {
    position = "first";
  } else if (isSameDay(cellDate, itemEnd)) {
    position = "last";
  } else {
    position = "middle";
  }

  const renderBadgeText = ["first", "none"].includes(position);

  const color = (badgeVariant === "dot" ? `${transaction.color}-dot` : transaction.color) as VariantProps<typeof transactionBadgeVariants>["color"];

  const transactionBadgeClasses = cn(transactionBadgeVariants({ color, multiDayPosition: position, className }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <DraggableEvent transaction={transaction}>
      <TransactionDetailPopup transaction={transaction}>
        <div role="button" tabIndex={0} className={transactionBadgeClasses} onKeyDown={handleKeyDown}>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
            {!["middle", "last"].includes(position) && ["mixed", "dot"].includes(badgeVariant) && (
              <svg width="6" height="6" viewBox="0 0 8 8" className="event-dot shrink-0">
                <circle cx="4" cy="4" r="4" />
              </svg>
            )}

            {renderBadgeText && (
              <p className="truncate font-semibold text-[11px] leading-tight">
                {transactionCurrentDay && (
                  <span className="text-[10px] opacity-80">
                    {transactionCurrentDay}/{transactionTotalDays} •{" "}
                  </span>
                )}
                {transaction.title}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 pl-1">
            {renderBadgeText && transaction.amount ? (
              <span className={cn("shrink-0 text-[10px] font-bold tracking-tight opacity-90", transaction.type === "INCOME" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>
                ₹{formatCompactNumber(transaction.amount)}
              </span>
            ) : null}

            {renderBadgeText && <span className="shrink-0 text-[10px] opacity-75">{format(new Date(transaction.startDate), "h:mm a")}</span>}
          </div>
        </div>
      </TransactionDetailPopup>
    </DraggableEvent>
  );
}

interface IDayCellProps {
  cell: ICalendarCell;
  transactions: ITransaction[];
  transactionPositions: Record<string, number>;
}

const MAX_VISIBLE_TRANSACTIONS = 3;

export function DayCell({ cell, transactions, transactionPositions }: IDayCellProps) {
  const { push } = useRouter();
  const { setSelectedDate } = useCalendar();

  const { day, currentMonth, date } = cell;

  const cellTransactions = useMemo(() => getMonthCellTransactions(date, transactions, transactionPositions), [date, transactions, transactionPositions]);
  const isSunday = date.getDay() === 0;

  const handleClick = () => {
    setSelectedDate(date);
    push("/reports?view=day");
  };

  return (
    <DroppableDayCell cell={cell}>
      <div className={cn("flex h-full flex-col gap-1 border-l border-t py-1.5 lg:pb-2 lg:pt-1", isSunday && "border-l-0")}>
        <button
          onClick={handleClick}
          className={cn(
            "flex size-6 translate-x-1 items-center justify-center rounded-full text-xs font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:px-2",
            !currentMonth && "opacity-20",
            isToday(date) && "bg-primary font-bold text-primary-foreground hover:bg-primary"
          )}
        >
          {day}
        </button>

        <div className={cn("flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0", !currentMonth && "opacity-50")}>
          {[0, 1, 2].map(position => {
            const transaction = cellTransactions.find(t => t.position === position);
            const transactionKey = transaction ? `transaction-${transaction.id}-${position}` : `empty-${position}`;

            return (
              <div key={transactionKey} className="lg:flex-1">
                {transaction && (
                  <>
                    <TransactionBullet className="lg:hidden" color={transaction.color} />
                    <MonthTransactionBadge className="hidden lg:flex" transaction={transaction} cellDate={startOfDay(date)} />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {cellTransactions.length > MAX_VISIBLE_TRANSACTIONS && (
          <p className={cn("h-4.5 px-1.5 text-xs font-semibold text-muted-foreground", !currentMonth && "opacity-50")}>
            <span className="sm:hidden">+{cellTransactions.length - MAX_VISIBLE_TRANSACTIONS}</span>
            <span className="hidden sm:inline"> {cellTransactions.length - MAX_VISIBLE_TRANSACTIONS} more...</span>
          </p>
        )}
      </div>
    </DroppableDayCell>
  );
}

interface ICalendarMonthViewProps {
  singleDayTransactions: ITransaction[];
  multiDayTransactions: ITransaction[];
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarMonthView({ singleDayTransactions, multiDayTransactions }: ICalendarMonthViewProps) {
  const { selectedDate } = useCalendar();

  const allTransactions = [...multiDayTransactions, ...singleDayTransactions];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const transactionPositions = useMemo(
    () => calculateMonthTransactionPositions(multiDayTransactions, singleDayTransactions, selectedDate),
    [multiDayTransactions, singleDayTransactions, selectedDate]
  );

  return (
    <div>
      <div className="grid grid-cols-7 divide-x">
        {WEEK_DAYS.map(day => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-xs font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 overflow-hidden">
        {cells.map(cell => (
          <DayCell key={cell.date.toISOString()} cell={cell} transactions={allTransactions} transactionPositions={transactionPositions} />
        ))}
      </div>
    </div>
  );
}
