// app/(main)/stock-movements/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"

export default function StockMovementsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>

        <StatsCardSkeleton />

        <div className="border rounded-lg p-2">
          <TableSkeleton columnCount={9} rowCount={5} />
        </div>
      </main>
    </div>
  )
}
