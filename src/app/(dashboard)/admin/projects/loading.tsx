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

            {/* Stats Section */}
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

            <div className="mt-6">
                <Card className="border-0 shadow-none bg-transparent md:border md:shadow-sm md:bg-card">
                    <CardHeader className="px-0 md:px-6">
                        <Skeleton className="h-6 w-[120px]" />
                    </CardHeader>
                    <CardContent className="px-0 md:px-6">
                        <div className="space-y-6">
                            {/* Search and Sort Toolbar */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <Skeleton className="h-9 w-full max-w-sm" />
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Skeleton className="h-9 w-[80px]" />
                                </div>
                            </div>

                            {/* Projects Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Card key={i} className="flex flex-col">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <Skeleton className="h-10 w-10 rounded-lg" />
                                                <Skeleton className="h-5 w-16 rounded-full" />
                                            </div>
                                            <Skeleton className="h-6 w-3/4 mt-4 mb-2" />
                                            <Skeleton className="h-4 w-full" />
                                        </CardHeader>
                                        <CardContent className="flex-1 mt-auto">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <Skeleton className="h-4 w-12" />
                                                        <Skeleton className="h-4 w-8" />
                                                    </div>
                                                    <Skeleton className="h-2 w-full rounded-full" />
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
