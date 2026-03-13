import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Skeleton className="h-8 w-[150px]" />
                    <Skeleton className="h-4 w-[250px] mt-2" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-1" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
                <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-0 shadow-none">
                    <CardHeader className="px-0">
                        <Skeleton className="h-6 w-[150px]" />
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-10 w-[300px]" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="flex flex-col rounded-xl border bg-card shadow-sm h-[280px]">
                                        {/* Top Bar Placeholders */}
                                        <div className="flex items-center justify-between px-3 pt-2 pb-0">
                                            <Skeleton className="h-4 w-16 rounded-full" />
                                            <Skeleton className="h-7 w-7 rounded-full" />
                                        </div>

                                        <div className="pt-2 pb-5 px-5 space-y-5">
                                            {/* Hero Section */}
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-14 w-14 rounded-xl" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-5 w-3/4" />
                                                    <Skeleton className="h-4 w-1/3 rounded-full" />
                                                </div>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {/* Created Stats Box */}
                                                <div className="p-1 rounded-lg border h-[42px]">
                                                     <div className="space-y-1 h-full flex flex-col justify-center">
                                                        <Skeleton className="h-2 w-10" />
                                                        <Skeleton className="h-3 w-16" />
                                                     </div>
                                                </div>
                                                {/* Sub-cats Stats Box */}
                                                <div className="p-1 rounded-lg border h-[42px]">
                                                     <div className="space-y-1 h-full flex flex-col justify-center">
                                                        <Skeleton className="h-2 w-10" />
                                                        <Skeleton className="h-3 w-16" />
                                                     </div>
                                                </div>
                                            </div>

                                            {/* Sub-categories */}
                                            <div className="pt-1 flex gap-2">
                                                <Skeleton className="h-6 w-16 rounded-md" />
                                                <Skeleton className="h-6 w-20 rounded-md" />
                                                <Skeleton className="h-6 w-12 rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
