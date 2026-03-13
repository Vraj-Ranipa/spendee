
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
        {/* Left Column (5 spans) */}
        <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full h-[200px] rounded-lg" />
                </CardContent>
            </Card>
        </div>

        {/* Right Column (3 spans) */}
         <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                     <Skeleton className="h-6 w-16" />
                </CardHeader>
                <CardContent>
                    <div className="border p-3 rounded-lg flex items-center justify-between">
                         <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-40" />
                         </div>
                         <Skeleton className="h-6 w-10" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader className="space-y-2">
                     <Skeleton className="h-6 w-32" />
                     <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                     <Skeleton className="w-full h-[150px] rounded-lg" />
                </CardContent>
            </Card>

             <div className="flex flex-col gap-3">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
            </div>
         </div>
      </div>
    </div>
  )
}
