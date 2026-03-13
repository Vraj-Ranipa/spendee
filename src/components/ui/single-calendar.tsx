"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export function SingleCalendar(props: React.ComponentProps<typeof Calendar>) {
  return <Calendar mode="single" {...props} />;
}
