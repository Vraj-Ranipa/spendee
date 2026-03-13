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
                                <Skeleton className="h-4 w-[300px]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Skeleton className="h-6 w-[80px] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 flex flex-col gap-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                    {/* Left Column: Sub-Categories Skeleton */}
                    <div className="sticky top-6 h-fit">
                         <Card className="h-[600px] flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-[120px]" />
                                    <Skeleton className="h-3 w-[180px]" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </CardHeader>
                            <CardContent className="flex-1 p-3 pt-0">
                                <div className="h-full rounded-md border bg-muted/10 p-3 space-y-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="bg-background/80 p-3 rounded-xl border flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-1 flex-1">
                                                        <Skeleton className="h-4 w-3/4" />
                                                        <Skeleton className="h-3 w-1/2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 py-2 px-3 bg-muted/50 rounded-lg">
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                            <Skeleton className="h-1.5 w-full rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                         </Card>
                    </div>

                    {/* Right Column: Info & Transactions Skeleton */}
                    <div className="flex flex-col gap-6">
                        {/* Category Info Skeleton */}
                        <Card>
                            <CardHeader className="px-4 pt-4 pb-2">
                                <Skeleton className="h-5 w-[160px]" />
                            </CardHeader>
                            <CardContent className="px-4 pb-4 flex flex-col gap-4">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {/* Financial Summary */}
                                    <div className="h-[90px] rounded-xl border p-3.5 flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-7 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                    </div>
                                    {/* Description */}
                                    <Skeleton className="h-[90px] w-full rounded-lg" />
                                </div>
                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions Skeleton */}
                         <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-[180px]" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-[140px]" />
                                                    <Skeleton className="h-3 w-[90px]" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-4 w-[70px]" />
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
