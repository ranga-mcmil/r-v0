import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function ReferrersLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Referrers</h1>
            <p className="text-muted-foreground">Manage your referrer relationships</p>
          </div>
          <div className="h-10 w-[120px] rounded-md bg-muted" />
        </div>

        <StatsCardSkeleton />

        <div className="border rounded-lg p-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-full rounded-md bg-muted" />
            <div className="h-10 w-[100px] rounded-md bg-muted" />
          </div>
          <div className="h-10 w-[300px] rounded-md bg-muted mb-4" />
          <TableSkeleton columnCount={6} rowCount={5} />
        </div>
      </main>
    </div>
  )
}
