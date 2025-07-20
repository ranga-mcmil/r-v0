// app/(main)/reports/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"

export default function ReportsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[280px]" />
          </div>
        </div>

        <StatsCardSkeleton />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px] mb-4" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}