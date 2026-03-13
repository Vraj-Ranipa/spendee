import { Calendar, Clock, User } from "lucide-react";
import { parseISO, areIntervalsOverlapping, format } from "date-fns";
import { useCallback } from "react";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SingleCalendar } from "@/components/ui/single-calendar";

import { DroppableTimeBlock } from "@/components/calendar/components/dnd/droppable-time-block";
import { 
  TransactionBlock, 
  CalendarTimeline, 
  DayViewMultiDayTransactionsRow, 
  TransactionPageControls, 
  TransactionBlockNav, 
  useTransactionPage, 
  getVisibleGroups 
} from "@/components/calendar/components/week-and-day-view/shared-components";

import { cn } from "@/lib/utils";
import { groupTransactions, getTransactionBlockStyle, isWorkingHour, getCurrentTransactions, getVisibleHours } from "@/components/calendar/helpers";

import type { ITransaction } from "@/components/calendar/interfaces";

interface IProps {
  singleDayTransactions: ITransaction[];
  multiDayTransactions: ITransaction[];
}

export function CalendarDayView({ singleDayTransactions, multiDayTransactions }: IProps) {
  const { selectedDate, setSelectedDate, users, visibleHours, workingHours } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(visibleHours, singleDayTransactions);

  const currentTransactions = getCurrentTransactions(singleDayTransactions);

  const dayTransactions = singleDayTransactions.filter(t => {
    const tDate = parseISO(t.startDate);
    return (
      tDate.getDate() === selectedDate.getDate() &&
      tDate.getMonth() === selectedDate.getMonth() &&
      tDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const groupedTransactions = groupTransactions(dayTransactions);
  const { page, setPage, totalPages } = useTransactionPage(groupedTransactions.length, 3);
  const visibleGroups = getVisibleGroups(groupedTransactions, page, 3);

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <div>
          <DayViewMultiDayTransactionsRow selectedDate={selectedDate} multiDayTransactions={multiDayTransactions} />

          {/* Day header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <span className="flex-1 border-l py-2 text-center text-xs font-medium text-muted-foreground">
              {format(selectedDate, "EE")} <span className="font-semibold text-foreground">{format(selectedDate, "d")}</span>
            </span>
          </div>
        </div>

        <ScrollArea className="h-[800px]" type="always">
          <div className="flex">
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

            {/* Day grid - full width, no overflow */}
            <div className="relative flex-1 border-l">
              <div className="relative">
                {hours.map((hour, index) => {
                  const isDisabled = !isWorkingHour(selectedDate, hour, workingHours);

                  return (
                    <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: "96px" }}>
                      {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={0}>
                        <div className="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </DroppableTimeBlock>

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={15}>
                        <div className="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </DroppableTimeBlock>

                      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={30}>
                        <div className="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </DroppableTimeBlock>

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={45}>
                        <div className="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </DroppableTimeBlock>
                    </div>
                  );
                })}

                {/* Only render the current page's groups — key={page} remounts to restart animation */}
                <>
                  {visibleGroups.map((group, relGroupIndex) =>
                    group.map(t => {
                      let style = getTransactionBlockStyle(t, selectedDate, relGroupIndex, visibleGroups.length, { from: earliestEventHour, to: latestEventHour });
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
                          <TransactionBlockNav
                            totalPages={totalPages}
                            currentPage={page}
                            onPageChange={setPage}
                            showPrev={relGroupIndex === 0}
                            showNext={relGroupIndex === visibleGroups.length - 1}
                            totalTransactions={groupedTransactions.length}
                            perPage={3}
                          />
                          <TransactionBlock transaction={t} hasNavigation={totalPages > 1} />
                        </div>
                      );
                    })
                  )}
                </>

                {/* Carousel nav — only appears when there are multiple pages */}
                <TransactionPageControls totalPages={totalPages} currentPage={page} onPageChange={setPage} />
              </div>

              <CalendarTimeline firstVisibleHour={earliestEventHour} lastVisibleHour={latestEventHour} />
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="hidden w-64 divide-y border-l md:block">
        <SingleCalendar className="mx-auto w-fit" mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />

        <div className="flex-1 space-y-3">
          {currentTransactions.length > 0 ? (
            <div className="flex items-start gap-2 px-4 pt-4">
              <span className="relative mt-[5px] flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-green-600"></span>
              </span>

              <p className="text-sm font-semibold text-foreground">Happening now</p>
            </div>
          ) : (
            <p className="p-4 text-center text-sm italic text-muted-foreground">No appointments or consultations at the moment</p>
          )}

          {currentTransactions.length > 0 && (
            <ScrollArea className="h-[422px] px-4" type="always">
              <div className="space-y-6 pb-4">
                {currentTransactions.map(t => {
                  const user = users.find(user => user.id === t.user.id);

                  return (
                    <div key={t.id} className="space-y-1.5">
                      <p className="line-clamp-2 text-sm font-semibold">{t.title}</p>

                      {user && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <User className="size-3.5" />
                          <span className="text-sm">{user.name}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span className="text-sm">{format(new Date(), "MMM d, yyyy")}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span className="text-sm">
                          {format(parseISO(t.startDate), "h:mm a")} - {format(parseISO(t.endDate), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
