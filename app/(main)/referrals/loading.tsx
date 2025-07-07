// app/(main)/referrals/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"

export default function ReferralsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <StatsCardSkeleton />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="border rounded-lg p-2">
              <TableSkeleton columnCount={4} rowCount={5} />
            </div>
          </div>
          <div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </main>
    </div>
  )
}
