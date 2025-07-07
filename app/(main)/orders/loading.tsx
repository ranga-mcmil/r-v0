// app/(main)/orders/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function OrdersLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[280px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <StatsCardSkeleton />

        {/* Search form skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-[200px]" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="border rounded-lg p-2">
          <TableSkeleton columnCount={9} rowCount={5} />
        </div>
      </main>
    </div>
  )
}