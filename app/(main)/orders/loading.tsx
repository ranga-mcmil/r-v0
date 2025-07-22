// app/(main)/orders/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrdersLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="w-full">
          <Tabs value="all">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex">
              {['All Orders', 'Quotations', 'Layaway', 'Ready', 'Reports'].map((tab, i) => (
                <TabsTrigger key={i} value={tab.toLowerCase()} disabled className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-[80px]" />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Card */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-[120px]" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </div>
          </CardHeader>
        </Card>

        {/* Table */}
        <div className="border rounded-lg p-2">
          <TableSkeleton columnCount={9} rowCount={5} />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-[200px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[80px]" />
            <div className="flex items-center space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
            <Skeleton className="h-8 w-[60px]" />
          </div>
        </div>
      </main>
    </div>
  )
}