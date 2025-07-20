// app/(main)/reports/sales-detail/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function SalesDetailReportLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Skeleton className="h-7 w-[200px] mb-1" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-10 w-[200px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-10 w-[200px]" />
              </div>
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>
        </Card>

        <div className="border rounded-lg p-2">
          <TableSkeleton columnCount={8} rowCount={5} />
        </div>
      </main>
    </div>
  )
}
