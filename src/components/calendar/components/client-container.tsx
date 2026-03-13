"use client";

import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import { DndProviderWrapper } from "@/components/calendar/components/dnd/dnd-provider";

import { CalendarHeader } from "@/components/calendar/components/header/calendar-header";
import { CalendarYearView } from "@/components/calendar/components/year-view/calendar-year-view";
import { CalendarMonthView } from "@/components/calendar/components/month-view/calendar-month-view";
import { CalendarAgendaView } from "@/components/calendar/components/agenda-view/calendar-agenda-view";
import { CalendarDayView } from "@/components/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/components/calendar/components/week-and-day-view/calendar-week-view";

import type { TCalendarView } from "@/components/calendar/types";

interface IProps {
  view: TCalendarView;
}

export function ClientContainer({ view }: IProps) {
  const { selectedDate, selectedUserId, transactions } = useCalendar();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tStartDate = parseISO(t.startDate);
      const tEndDate = parseISO(t.endDate);

      if (view === "year") {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        const isInSelectedYear = tStartDate <= yearEnd && tEndDate >= yearStart;
        const isUserMatch = selectedUserId === "all" || t.user.id === selectedUserId;
        return isInSelectedYear && isUserMatch;
      }

      if (view === "month" || view === "agenda") {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const isInSelectedMonth = tStartDate <= monthEnd && tEndDate >= monthStart;
        const isUserMatch = selectedUserId === "all" || t.user.id === selectedUserId;
        return isInSelectedMonth && isUserMatch;
      }

      if (view === "week") {
        const dayOfWeek = selectedDate.getDay();

        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const isInSelectedWeek = tStartDate <= weekEnd && tEndDate >= weekStart;
        const isUserMatch = selectedUserId === "all" || t.user.id === selectedUserId;
        return isInSelectedWeek && isUserMatch;
      }

      if (view === "day") {
        const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
        const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
        const isInSelectedDay = tStartDate <= dayEnd && tEndDate >= dayStart;
        const isUserMatch = selectedUserId === "all" || t.user.id === selectedUserId;
        return isInSelectedDay && isUserMatch;
      }
    });
  }, [selectedDate, selectedUserId, transactions, view]);

  const singleDayTransactions = filteredTransactions.filter(t => {
    const startDate = parseISO(t.startDate);
    const endDate = parseISO(t.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayTransactions = filteredTransactions.filter(t => {
    const startDate = parseISO(t.startDate);
    const endDate = parseISO(t.endDate);
    return !isSameDay(startDate, endDate);
  });

  // For year view, we only care about the start date
  // by using the same date for both start and end,
  // we ensure only the start day will show a dot
  const transactionStartDates = useMemo(() => {
    return filteredTransactions.map(t => ({ ...t, endDate: t.startDate }));
  }, [filteredTransactions]);

  return (
    <div className="overflow-hidden rounded-xl border">
      <CalendarHeader view={view} transactions={filteredTransactions} />

      <DndProviderWrapper>
        {view === "day" && <CalendarDayView singleDayTransactions={singleDayTransactions} multiDayTransactions={multiDayTransactions} />}
        {view === "month" && <CalendarMonthView singleDayTransactions={singleDayTransactions} multiDayTransactions={multiDayTransactions} />}
        {view === "week" && <CalendarWeekView singleDayTransactions={singleDayTransactions} multiDayTransactions={multiDayTransactions} />}
        {view === "year" && <CalendarYearView allTransactions={transactionStartDates} />}
        {view === "agenda" && <CalendarAgendaView singleDayTransactions={singleDayTransactions} multiDayTransactions={multiDayTransactions} />}
      </DndProviderWrapper>
    </div>
  );
}
