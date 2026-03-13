"use client";

import { format, parseISO } from "date-fns";
import { Clock, Text, User, CalendarDays, IndianRupee, Tag, Briefcase, ArrowDownRight, ArrowUpRight } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { ITransaction } from "@/components/calendar/interfaces";

interface ITransactionDetailPopupProps {
  transaction: ITransaction;
  children: React.ReactNode;
}

export function TransactionDetailPopup({ transaction, children }: ITransactionDetailPopupProps) {
  const startDate = parseISO(transaction.startDate);
  const endDate = parseISO(transaction.endDate);

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 gap-0 p-0 sm:max-w-80" side="bottom">
        <div className="flex flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <Badge variant={transaction.type === "INCOME" ? "default" : "destructive"} className={cn("mt-1 w-fit", transaction.type === "INCOME" && "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700")}>
               {transaction.type === "INCOME" ? <ArrowDownRight className="mr-1 size-3" /> : <ArrowUpRight className="mr-1 size-3" />}
               {transaction.type === "INCOME" ? "Income" : "Expense"}
            </Badge>
            {transaction.amount !== undefined && transaction.amount !== null && (
               <div className={cn("flex text-2xl font-bold tracking-tight", transaction.type === "INCOME" ? "text-emerald-600 dark:text-emerald-500" : "text-destructive")}>
                 <IndianRupee className="mr-0.5 mt-1 size-5 shrink-0" />
                 <span className="truncate">{Number(transaction.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
            )}
          </div>

          <div className="mb-3 flex items-start gap-2">
             <div
              className={cn(
                "mt-1 size-3 shrink-0 rounded-full",
                transaction.color === "blue" && "bg-blue-600",
                transaction.color === "green" && "bg-green-600",
                transaction.color === "red" && "bg-red-600",
                transaction.color === "yellow" && "bg-yellow-600",
                transaction.color === "purple" && "bg-purple-600",
                transaction.color === "orange" && "bg-orange-600",
                transaction.color === "gray" && "bg-neutral-600"
              )}
            />
            <h4 className="font-semibold leading-tight tracking-tight">{transaction.title}</h4>
          </div>

          <div className="mt-2 flex gap-2 text-sm text-foreground/80">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
             <span>{format(startDate, "EEEE, MMMM d, yyyy")}</span>
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-sm text-foreground/80">
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <span>
              {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-sm text-foreground/80">
            <User className="size-4 shrink-0 text-muted-foreground" />
            <span>{transaction.user.name}</span>
          </div>
          
          {transaction.categoryName && (
             <div className="mt-1.5 flex items-center gap-2 text-sm text-foreground/80">
                <Tag className="size-4 shrink-0 text-muted-foreground" />
                <span>{transaction.categoryName}</span>
             </div>
          )}

          {transaction.projectName && (
             <div className="mt-1.5 flex items-center gap-2 text-sm text-foreground/80">
                <Briefcase className="size-4 shrink-0 text-muted-foreground" />
                <span>{transaction.projectName}</span>
             </div>
          )}

          {transaction.description && (
            <div className="mt-3 flex gap-2 border-t pt-3 text-sm text-foreground/80">
              <Text className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="whitespace-pre-wrap">{transaction.description}</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
