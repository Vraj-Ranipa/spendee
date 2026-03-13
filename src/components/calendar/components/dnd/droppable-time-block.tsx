"use client";

import { useDrop } from "react-dnd";
import { parseISO, differenceInMilliseconds } from "date-fns";

import { useUpdateTransaction } from "@/components/calendar/hooks/use-update-event";

import { cn } from "@/lib/utils";
import { ItemTypes } from "@/components/calendar/components/dnd/draggable-event";

import type { ITransaction } from "@/components/calendar/interfaces";

interface DroppableTimeBlockProps {
  date: Date;
  hour: number;
  minute: number;
  children: React.ReactNode;
}

export function DroppableTimeBlock({ date, hour, minute, children }: DroppableTimeBlockProps) {
  const { updateTransaction } = useUpdateTransaction();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item: { transaction: ITransaction }) => {
        const droppedTransaction = item.transaction;

        const transactionStartDate = parseISO(droppedTransaction.startDate);
        const transactionEndDate = parseISO(droppedTransaction.endDate);

        const transactionDurationMs = differenceInMilliseconds(transactionEndDate, transactionStartDate);

        const newStartDate = new Date(date);
        newStartDate.setHours(hour, minute, 0, 0);
        const newEndDate = new Date(newStartDate.getTime() + transactionDurationMs);

        updateTransaction({
          ...droppedTransaction,
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        });

        return { moved: true };
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [date, hour, minute, updateTransaction]
  );

  return (
    <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className={cn("h-[24px]", isOver && canDrop && "bg-accent/50")}>
      {children}
    </div>
  );
}
