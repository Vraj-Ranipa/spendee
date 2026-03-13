import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DetailPageSkeleton() {
    return (
        <div className="flex flex-col h-full w-full bg-gradient-to-b from-muted/50 to-background overflow-hidden relative animate-in fade-in duration-500">
             {/* Header Skeleton */}
            <div className="flex-none px-4 py-3 md:px-6 border-b border-border/60 bg-background/90 backdrop-blur-xl z-10 shadow-sm">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Skeleton className="h-8 w-8 rounded-full" /> {/* Back Button */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-32" /> {/* Title */}
                                <Skeleton className="h-5 w-12 rounded-full" /> {/* ID Badge */}
                            </div>
                            <Skeleton className="h-3 w-40" /> {/* Created Date */}
                        </div>
                    </div>
                     <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <Skeleton className="h-8 w-20" /> {/* Edit Button */}
                        <Skeleton className="h-8 w-20" /> {/* Delete Button */}
                    </div>
                 </div>
            </div>

            {/* Main Content Grid */}
             <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full content-start">
                    
                    {/* Column 1 */}
                    <div className="flex flex-col gap-4">
                         {/* Hero Amount Skeleton */}
                        <Card className="border-none shadow-md bg-gradient-to-br from-muted/40 to-background overflow-hidden relative">
                             {/* Abstract shimmer effect */}
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                     <Skeleton className="h-3 w-24" />
                                     <Skeleton className="h-12 w-48" />
                                     <Skeleton className="h-12 w-full rounded-xl opacity-70" />
                                </div>
                            </CardContent>
                        </Card>
                         {/* Project Context Skeleton */}
                         <Card className="flex-1 bg-gradient-to-br from-card to-muted/20 overflow-hidden">
                            <CardHeader className="pb-2 pt-5 px-5">
                                 <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent className="px-5 pb-5 space-y-4">
                                <Skeleton className="h-20 w-full rounded-lg" />
                                <div className="grid grid-cols-2 gap-4">
                                     <Skeleton className="h-12 w-full" />
                                     <Skeleton className="h-12 w-full" />
                                </div>
                            </CardContent>
                         </Card>
                    </div>

                    {/* Column 2 - Details */}
                    <div className="flex flex-col gap-4 h-full">
                         <Card className="h-full flex flex-col bg-gradient-to-br from-card to-muted/20 overflow-hidden">
                            <CardHeader className="pb-2 pt-5 px-5">
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-6 px-5 pb-5 flex-1">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-24" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[90%]" />
                                            <Skeleton className="h-4 w-[95%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-16 w-full rounded-lg" />
                                    </div>
                                </div>
                                <div className="mt-auto pt-4">
                                    <Separator className="mb-4" />
                                    <Skeleton className="h-3 w-24 mb-2" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </div>
                            </CardContent>
                         </Card>
                    </div>

                    {/* Column 3 - Metadata */}
                    <div className="flex flex-col gap-4">
                        <Card className="bg-gradient-to-br from-card to-muted/20">
                            <CardHeader className="pb-2 pt-5 px-5">
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent className="px-5 pb-5 space-y-4">
                                <Skeleton className="h-16 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </CardContent>
                        </Card>
                        
                         <Card className="bg-gradient-to-br from-card to-muted/20">
                            <CardHeader className="pb-2 pt-5 px-5">
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                             <CardContent className="px-5 pb-5 space-y-4">
                                <Skeleton className="h-20 w-full rounded-lg" />
                                <Skeleton className="h-8 w-full rounded-lg" />
                            </CardContent>
                        </Card>

                        <div className="px-2 mt-auto space-y-3 opacity-60">
                             <div className="flex justify-between items-center">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-4 w-12" />
                             </div>
                             <Separator />
                             <div className="flex justify-between items-center">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-24" />
                             </div>
                             <div className="flex justify-between items-center">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-24" />
                             </div>
                        </div>
                    </div>

                </div>
             </div>
        </div>
    );
}
