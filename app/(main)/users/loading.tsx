import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function UsersLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage system users and permissions</p>
          </div>
        </div>

        <StatsCardSkeleton />

        <div className="border rounded-lg p-2">
          <TableSkeleton columnCount={7} rowCount={10} />
        </div>
      </main>
    </div>
  )
}
