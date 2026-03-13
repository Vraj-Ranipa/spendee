import { startOfWeek, addDays, format, parseISO, isSameDay, areIntervalsOverlapping } from "date-fns";
import { useCallback } from "react";


import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import { ScrollArea } from "@/components/ui/scroll-area";


import { DroppableTimeBlock } from "@/components/calendar/components/dnd/droppable-time-block";
import { 
  TransactionBlock, 
  CalendarTimeline, 
  WeekViewMultiDayTransactionsRow, 
  TransactionPageControls, 
  TransactionBlockNav, 
  useTransactionPage, 
  getVisibleGroups 
} from "@/components/calendar/components/week-and-day-view/shared-components";

import { cn } from "@/lib/utils";
import { groupTransactions, getTransactionBlockStyle, isWorkingHour, getVisibleHours } from "@/components/calendar/helpers";

import type { ITransaction } from "@/components/calendar/interfaces";

interface IProps {
  singleDayTransactions: ITransaction[];
  multiDayTransactions: ITransaction[];
}

// Per-day column component so each day has independent paging state
interface WeekDayColumnProps {
  day: Date;
  singleDayTransactions: ITransaction[];
  hours: number[];
  workingHours: ReturnType<typeof useCalendar>["workingHours"];
  earliestEventHour: number;
  latestEventHour: number;
}

function WeekDayColumn({ day, singleDayTransactions, hours, workingHours, earliestEventHour, latestEventHour }: WeekDayColumnProps) {
  const dayTransactions = singleDayTransactions.filter(t => isSameDay(parseISO(t.startDate), day) || isSameDay(parseISO(t.endDate), day));
  const groupedTransactions = groupTransactions(dayTransactions);
  const { page, setPage, totalPages } = useTransactionPage(groupedTransactions.length);
  const visibleGroups = getVisibleGroups(groupedTransactions, page);

  return (
    <div className="relative flex-1 min-w-0">
      {hours.map((hour, index) => {
        const isDisabled = !isWorkingHour(day, hour, workingHours);
        return (
          <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: "96px" }}>
            {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}

            <DroppableTimeBlock date={day} hour={hour} minute={0}>
              <div className="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent" />
            </DroppableTimeBlock>

            <DroppableTimeBlock date={day} hour={hour} minute={15}>
              <div className="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
            </DroppableTimeBlock>

            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

            <DroppableTimeBlock date={day} hour={hour} minute={30}>
              <div className="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
            </DroppableTimeBlock>

            <DroppableTimeBlock date={day} hour={hour} minute={45}>
              <div className="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
            </DroppableTimeBlock>
          </div>
        );
      })}

      {visibleGroups.map((group, relGroupIndex) =>
        group.map(t => {
          let style = getTransactionBlockStyle(t, day, relGroupIndex, visibleGroups.length, { from: earliestEventHour, to: latestEventHour });
          const hasOverlap = visibleGroups.some(
            (otherGroup, otherIndex) =>
              otherIndex !== relGroupIndex &&
              otherGroup.some(otherTransaction =>
                areIntervalsOverlapping(
                  { start: parseISO(t.startDate), end: parseISO(t.endDate) },
                  { start: parseISO(otherTransaction.startDate), end: parseISO(otherTransaction.endDate) }
                )
              )
          );

          if (!hasOverlap) style = { ...style, width: '100%', left: '0%' };

          return (
            <div key={`${page}-${t.id}`} className="absolute p-1 animate-event-slide-in" style={style}>
              <TransactionBlockNav totalPages={totalPages} currentPage={page} onPageChange={setPage} totalTransactions={groupedTransactions.length} />
              <TransactionBlock transaction={t} hasNavigation={totalPages > 1} />
            </div>
          );
        })
      )}

      <TransactionPageControls totalPages={totalPages} currentPage={page} onPageChange={setPage} />
    </div>
  );
}

export function CalendarWeekView({ singleDayTransactions, multiDayTransactions }: IProps) {
  const { selectedDate, workingHours, visibleHours } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(visibleHours, singleDayTransactions);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <>
      <div className="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
        <p>Weekly view is not available on smaller devices.</p>
        <p>Please switch to daily or monthly view.</p>
      </div>

      <div className="hidden flex-col sm:flex">
        <div>
          <WeekViewMultiDayTransactionsRow selectedDate={selectedDate} multiDayTransactions={multiDayTransactions} />

          {/* Week header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <div className="flex flex-1 divide-x border-l">
              {weekDays.map((day, index) => (
                <span key={index} className="flex-1 min-w-0 py-2 text-center text-xs font-medium text-muted-foreground">
                  {format(day, "EE")} <span className="ml-1 font-semibold text-foreground">{format(day, "d")}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[736px]" type="always">
          <div className="flex overflow-hidden">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && <span className="text-xs text-muted-foreground">{format(new Date().setHours(hour, 0, 0, 0), "hh a")}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Week grid */}
            <div className="relative flex-1 border-l">
              <div className="flex divide-x">
                {weekDays.map((day, dayIndex) => (
                  <WeekDayColumn
                    key={dayIndex}
                    day={day}
                    singleDayTransactions={singleDayTransactions}
                    hours={hours}
                    workingHours={workingHours}
                    earliestEventHour={earliestEventHour}
                    latestEventHour={latestEventHour}
                  />
                ))}
              </div>

              <CalendarTimeline firstVisibleHour={earliestEventHour} lastVisibleHour={latestEventHour} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
