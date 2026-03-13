import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Header Section */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Skeleton className="h-8 w-[150px]" />
                    <Skeleton className="h-4 w-[250px] mt-2" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-9 w-[120px]" />
                </div>
            </div>

            {/* Stats Section - Matches PeopleStats (4 cards) */}
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

            {/* Table Section */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Filter Inputs */}
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-8 w-[200px]" />
                                <Skeleton className="h-8 w-[200px]" />
                            </div>
                            
                            {/* Table Skeleton */}
                            <div className="space-y-2 mt-4">
                                {/* Header Row */}
                                <div className="flex gap-4 mb-4">
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-6 w-1/4" />
                                </div>
                                {/* Data Rows */}
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex gap-4 py-2 border-b">
                                        <Skeleton className="h-10 w-1/4" />
                                        <Skeleton className="h-10 w-1/4" />
                                        <Skeleton className="h-10 w-1/4" />
                                        <Skeleton className="h-10 w-1/4" />
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

