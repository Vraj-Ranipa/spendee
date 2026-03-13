"use client";

import { useDrag } from "react-dnd";
import { useRef, useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

import { cn } from "@/lib/utils";

import type { ITransaction } from "@/components/calendar/interfaces";

export const ItemTypes = {
  EVENT: "event", // KEEP String internally since it only impacts DnD library identifiers
};

interface DraggableEventProps {
  transaction: ITransaction;
  children: React.ReactNode;
}

export function DraggableEvent({ transaction, children }: DraggableEventProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: () => {
      const width = ref.current?.offsetWidth || 0;
      const height = ref.current?.offsetHeight || 0;
      return { transaction, children, width, height };
    },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  drag(ref);

  return (
    <div ref={ref} className={cn(isDragging && "opacity-40")}>
      {children}
    </div>
  );
}
