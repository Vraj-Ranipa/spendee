import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/5">
            {/* Header Skeleton */}
            <div className="border-b bg-card">
                <div className="max-w-[1800px] mx-auto p-4 md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-[200px]" />
                                <Skeleton className="h-4 w-[100px]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Skeleton className="h-9 w-[100px]" />
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 flex flex-col gap-6">
                
                {/* Financial Overview Skeleton */}
                <section className="shrink-0">
                    <Skeleton className="h-6 w-[180px] mb-3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-7 w-[80px] mb-1" />
                                    <Skeleton className="h-3 w-[120px]" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full min-h-0">
                    {/* Left Column: Details (2 cols) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card className="h-full">
                            <CardHeader>
                                <Skeleton className="h-6 w-[150px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-14 w-full rounded-xl" />
                                <Skeleton className="h-14 w-full rounded-xl" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Transactions (3 cols) */}
                    <div className="lg:col-span-3 h-full min-h-0">
                         <Card className="h-full">
                            <CardHeader>
                                <Skeleton className="h-6 w-[150px]" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                     <div className="flex gap-2 mb-4">
                                        <Skeleton className="h-9 w-24" />
                                        <Skeleton className="h-9 w-24" />
                                     </div>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-[120px]" />
                                                    <Skeleton className="h-3 w-[80px]" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-4 w-[60px]" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
