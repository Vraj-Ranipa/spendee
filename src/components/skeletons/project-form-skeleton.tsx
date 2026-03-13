import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProjectFormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-8">
      {/* Left Column - Main Content (5 cols) */}
      <div className="space-y-6 lg:col-span-5">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            {/* Additional Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Sidebar (3 cols) */}
      <div className="space-y-6 lg:col-span-3">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
             <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Logo Upload Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-square w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Appearance Card */}
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
