// app/(main)/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>

        <StatsCardSkeleton />

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
