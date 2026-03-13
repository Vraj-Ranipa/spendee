import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
  isSameWeek,
  isSameDay,
  isSameMonth,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  differenceInMinutes,
  eachDayOfInterval,
  startOfDay,
  differenceInDays,
  endOfYear,
  startOfYear,
  subYears,
  addYears,
  isSameYear,
  isWithinInterval,
} from "date-fns";

import type { ICalendarCell, ITransaction } from "@/components/calendar/interfaces";
import type { TCalendarView, TVisibleHours, TWorkingHours } from "@/components/calendar/types";


export function rangeText(view: TCalendarView, date: Date) {
  const formatString = "MMM d, yyyy";
  let start: Date;
  let end: Date;

  switch (view) {
    case "agenda":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "year":
      start = startOfYear(date);
      end = endOfYear(date);
      break;
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return format(date, formatString);
    default:
      return "Error while formatting ";
  }

  return `${format(start, formatString)} - ${format(end, formatString)}`;
}

export function navigateDate(date: Date, view: TCalendarView, direction: "previous" | "next"): Date {
  const operations = {
    agenda: direction === "next" ? addMonths : subMonths,
    year: direction === "next" ? addYears : subYears,
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
  };

  return operations[view](date, 1);
}

export function getTransactionsCount(transactions: ITransaction[], date: Date, view: TCalendarView): number {
  const compareFns = {
    agenda: isSameMonth,
    year: isSameYear,
    day: isSameDay,
    week: isSameWeek,
    month: isSameMonth,
  };

  return transactions.filter(t => compareFns[view](new Date(t.startDate), date)).length;
}

// ================ Week and day view helper functions ================ //

export function getCurrentTransactions(transactions: ITransaction[]) {
  const now = new Date();
  return transactions.filter(t => isWithinInterval(now, { start: parseISO(t.startDate), end: parseISO(t.endDate) })) || null;
}

export function groupTransactions(dayTransactions: ITransaction[]) {
  const sortedTransactions = dayTransactions.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
  const groups: ITransaction[][] = [];

  for (const transaction of sortedTransactions) {
    const tStart = parseISO(transaction.startDate);

    let placed = false;
    for (const group of groups) {
      const lastInGroup = group[group.length - 1];
      const lastEnd = parseISO(lastInGroup.endDate);

      if (tStart >= lastEnd) {
        group.push(transaction);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([transaction]);
  }

  return groups;
}

export function getTransactionBlockStyle(transaction: ITransaction, day: Date, groupIndex: number, groupSize: number, visibleHoursRange?: { from: number; to: number }) {
  const startDate = parseISO(transaction.startDate);
  const dayStart = new Date(day.setHours(0, 0, 0, 0));
  const tStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = differenceInMinutes(tStart, dayStart);

  let top;

  if (visibleHoursRange) {
    const visibleStartMinutes = visibleHoursRange.from * 60;
    const visibleEndMinutes = visibleHoursRange.to * 60;
    const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;
    top = ((startMinutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
  } else {
    top = (startMinutes / 1440) * 100;
  }

  const width = 100 / groupSize;
  const left = groupIndex * width;

  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

export function isWorkingHour(day: Date, hour: number, workingHours: TWorkingHours) {
  const dayIndex = day.getDay() as keyof typeof workingHours;
  const dayHours = workingHours[dayIndex];
  return hour >= dayHours.from && hour < dayHours.to;
}

export function getVisibleHours(visibleHours: TVisibleHours, singleDayTransactions: ITransaction[]) {
  let earliestHour = visibleHours.from;
  let latestHour = visibleHours.to;

  singleDayTransactions.forEach(t => {
    const startHour = parseISO(t.startDate).getHours();
    const endTime = parseISO(t.endDate);
    const endHour = endTime.getHours() + (endTime.getMinutes() > 0 ? 1 : 0);
    if (startHour < earliestHour) earliestHour = startHour;
    if (endHour > latestHour) latestHour = endHour;
  });

  latestHour = Math.min(latestHour, 24);

  const hours = Array.from({ length: latestHour - earliestHour }, (_, i) => i + earliestHour);

  return { hours, earliestEventHour: earliestHour, latestEventHour: latestHour };
}

// ================ Month view helper functions ================ //

export function getCalendarCells(selectedDate: Date): ICalendarCell[] {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  const totalDays = firstDayOfMonth + daysInMonth;

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  const nextMonthCells = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_, i) => ({
    day: i + 1,
    currentMonth: false,
    date: new Date(currentYear, currentMonth + 1, i + 1),
  }));

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthTransactionPositions(multiDayTransactions: ITransaction[], singleDayTransactions: ITransaction[], selectedDate: Date) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const tPositions: { [key: string]: number } = {};
  const occupiedPositions: { [key: string]: boolean[] } = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach(day => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedTransactions = [
    ...multiDayTransactions.sort((a, b) => {
      const aDuration = differenceInDays(parseISO(a.endDate), parseISO(a.startDate));
      const bDuration = differenceInDays(parseISO(b.endDate), parseISO(b.startDate));
      return bDuration - aDuration || parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
    }),
    ...singleDayTransactions.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()),
  ];

  sortedTransactions.forEach(t => {
    const tStart = parseISO(t.startDate);
    const tEnd = parseISO(t.endDate);
    const tDays = eachDayOfInterval({
      start: tStart < monthStart ? monthStart : tStart,
      end: tEnd > monthEnd ? monthEnd : tEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
        tDays.every(day => {
          const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
          return dayPositions && !dayPositions[i];
        })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      tDays.forEach(day => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      tPositions[t.id] = position;
    }
  });

  return tPositions;
}

export function getMonthCellTransactions(date: Date, transactions: ITransaction[], tPositions: Record<string, number>) {
  const tForDate = transactions.filter(t => {
    const tStart = parseISO(t.startDate);
    const tEnd = parseISO(t.endDate);
    return (date >= tStart && date <= tEnd) || isSameDay(date, tStart) || isSameDay(date, tEnd);
  });

  return tForDate
    .map(t => ({
      ...t,
      position: tPositions[t.id] ?? -1,
      isMultiDay: t.startDate !== t.endDate,
    }))
    .sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return a.position - b.position;
    });
}
