// app/(main)/orders/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { ArrowLeft } from "lucide-react"

export default function OrderDetailsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-[180px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[100px]" />
              </div>
              <Skeleton className="h-4 w-[150px] mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-[140px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-3 w-[80px] mt-1" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-[90px]" />
                    <Skeleton className="h-3 w-[70px] mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Items Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[120px]" />
          </CardHeader>
          <CardContent>
            <TableSkeleton columnCount={7} rowCount={3} />
          </CardContent>
        </Card>

        {/* Payments Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
          </CardHeader>
          <CardContent>
            <TableSkeleton columnCount={7} rowCount={2} />
          </CardContent>
        </Card>

        {/* Notes Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[80px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}