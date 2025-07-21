// app/(main)/reports/date-range/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { ArrowLeft } from "lucide-react"

export default function DateRangeReportsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <Skeleton className="h-8 w-[250px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[160px]" />
          </div>
        </div>

        <StatsCardSkeleton />

        <div className="border rounded-lg p-4">
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <TableSkeleton columnCount={8} rowCount={10} />
        </div>
      </main>
    </div>
  )
}
