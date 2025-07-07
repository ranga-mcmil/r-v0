// app/(main)/referral-payments/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"

export default function ReferralPaymentsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <StatsCardSkeleton count={4} />

        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="border rounded-lg p-2">
            <TableSkeleton columnCount={6} rowCount={5} />
          </div>
        </div>
      </main>
    </div>
  )
}
