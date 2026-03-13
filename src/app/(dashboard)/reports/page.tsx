import { ClientContainer } from "@/components/calendar/components/client-container";
import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { getTransactions, getUsers } from "@/components/calendar/requests";
import { Settings } from "lucide-react";
import { ChangeBadgeVariantInput } from "@/components/calendar/components/change-badge-variant-input";
import { ChangeVisibleHoursInput } from "@/components/calendar/components/change-visible-hours-input";
import { ChangeWorkingHoursInput } from "@/components/calendar/components/change-working-hours-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { TCalendarView } from "@/components/calendar/types";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ReportsPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const viewQuery = typeof searchParams.view === 'string' ? searchParams.view : 'month';
    const validViews: TCalendarView[] = ["day", "week", "month", "year", "agenda"];
    const view: TCalendarView = validViews.includes(viewQuery as TCalendarView) ? (viewQuery as TCalendarView) : "month";

    const [transactions, users] = await Promise.all([getTransactions(), getUsers()]);

    return (
        <CalendarProvider users={users} transactions={transactions}>
            <div className="flex-1 space-y-4 px-2 py-4 md:px-4 md:py-6">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Calendar & Schedule</h2>
                        <p className="text-muted-foreground">Manage your detailed schedule.</p>
                    </div>
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Settings className="mr-2 size-4" />
                                <span className="hidden sm:inline">Calendar Settings</span>
                                <span className="sm:hidden">Settings</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[340px] sm:w-[380px] overflow-y-auto max-h-[80vh]">
                            <div className="flex flex-col space-y-2 mb-4">
                                <h4 className="font-semibold leading-none tracking-tight">Calendar Settings</h4>
                                <p className="text-sm text-muted-foreground">
                                    Manage your calendar preferences.
                                </p>
                            </div>
                            <div className="flex flex-col gap-6">
                                <ChangeBadgeVariantInput />
                                <ChangeVisibleHoursInput />
                                <ChangeWorkingHoursInput />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="mx-auto flex flex-col gap-4">
                    <ClientContainer view={view} />
                </div>
            </div>
        </CalendarProvider>
    );
}
