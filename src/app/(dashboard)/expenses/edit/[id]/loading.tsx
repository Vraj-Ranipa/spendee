
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <Card className="w-full max-w-7xl mx-auto pb-10">
      <CardContent className="space-y-6 pt-6">
        {/* 6 Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
             ))}
        </div>

        {/* 2 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full border shadow-sm">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </CardContent>
            </Card>

            <Card className="h-full border shadow-sm">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="w-full h-[150px] rounded-lg" />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}
