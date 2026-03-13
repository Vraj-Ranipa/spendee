import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { addMonths, startOfYear, isToday, format, isSameDay, parseISO, getDaysInMonth, startOfMonth } from "date-fns";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import { cn } from "@/lib/utils";

import type { ITransaction } from "@/components/calendar/interfaces";

// --- year-view-day-cell.tsx ---

interface IDayCellProps {
  day: number;
  date: Date;
  transactions: ITransaction[];
}

export function YearViewDayCell({ day, date, transactions }: IDayCellProps) {
  const { push } = useRouter();
  const { setSelectedDate } = useCalendar();

  const maxIndicators = 3;
  const transactionCount = transactions.length;

  const handleClick = () => {
    setSelectedDate(date);
    push("/reports?view=day");
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="flex h-11 flex-1 flex-col items-center justify-start gap-0.5 rounded-md pt-1 hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <div
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-xs font-medium",
          isToday(date) && "bg-primary font-semibold text-primary-foreground"
        )}
      >
        {day}
      </div>

      {transactionCount > 0 && (
        <div className="mt-0.5 flex gap-0.5">
          {transactionCount <= maxIndicators ? (
            transactions.map(t => (
              <div
                key={t.id}
                className={cn(
                  "size-1.5 rounded-full",
                  t.color === "blue" && "bg-blue-600",
                  t.color === "green" && "bg-green-600",
                  t.color === "red" && "bg-red-600",
                  t.color === "yellow" && "bg-yellow-600",
                  t.color === "purple" && "bg-purple-600",
                  t.color === "orange" && "bg-orange-600",
                  t.color === "gray" && "bg-neutral-600"
                )}
              />
            ))
          ) : (
            <>
              <div
                className={cn(
                  "size-1.5 rounded-full",
                  transactions[0].color === "blue" && "bg-blue-600",
                  transactions[0].color === "green" && "bg-green-600",
                  transactions[0].color === "red" && "bg-red-600",
                  transactions[0].color === "yellow" && "bg-yellow-600",
                  transactions[0].color === "purple" && "bg-purple-600",
                  transactions[0].color === "orange" && "bg-orange-600"
                )}
              />
              <span className="text-[7px] text-muted-foreground">+{transactionCount - 1}</span>
            </>
          )}
        </div>
      )}
    </button>
  );
}

// --- year-view-month.tsx ---

interface IMonthProps {
  month: Date;
  transactions: ITransaction[];
}

export function YearViewMonth({ month, transactions }: IMonthProps) {
  const { push } = useRouter();
  const { setSelectedDate } = useCalendar();

  const monthName = format(month, "MMMM");

  const daysInMonth = useMemo(() => {
    const totalDays = getDaysInMonth(month);
    const firstDay = startOfMonth(month).getDay();

    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blanks = Array(firstDay).fill(null);

    return [...blanks, ...days];
  }, [month]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleClick = () => {
    setSelectedDate(new Date(month.getFullYear(), month.getMonth(), 1));
    push("/month-view");
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded-t-lg border px-3 py-2 text-sm font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {monthName}
      </button>

      <div className="flex-1 space-y-2 rounded-b-lg border border-t-0 p-3">
        <div className="grid grid-cols-7 gap-x-0.5 text-center">
          {weekDays.map((day, index) => (
            <div key={index} className="text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-x-0.5 gap-y-2">
          {daysInMonth.map((day, index) => {
            if (day === null) return <div key={`blank-${index}`} className="h-10" />;

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const dayTransactions = transactions.filter(t => isSameDay(parseISO(t.startDate), date) || isSameDay(parseISO(t.endDate), date));

            return <YearViewDayCell key={`day-${day}`} day={day} date={date} transactions={dayTransactions} />;
          })}
        </div>
      </div>
    </div>
  );
}

// --- calendar-year-view.tsx ---

interface IYearViewProps {
  allTransactions: ITransaction[];
}

export function CalendarYearView({ allTransactions }: IYearViewProps) {
  const { selectedDate } = useCalendar();

  const months = useMemo(() => {
    const yearStart = startOfYear(selectedDate);
    return Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));
  }, [selectedDate]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map(month => (
          <YearViewMonth key={month.toString()} month={month} transactions={allTransactions} />
        ))}
      </div>
    </div>
  );
}
