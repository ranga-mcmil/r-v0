import { CardSkeleton } from "@/components/skeletons/card-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function InvoicesLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Manage and track customer invoices</p>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <CardSkeleton />

        <div className="border rounded-lg p-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
            <Skeleton className="h-10 w-full md:w-[50%]" />
            <div className="flex flex-col gap-2 md:flex-row">
              <Skeleton className="h-10 w-full md:w-[300px]" />
              <Skeleton className="h-10 w-full md:w-[180px]" />
            </div>
          </div>

          <TableSkeleton columnCount={8} rowCount={10} />
        </div>
      </main>
    </div>
  )
}
