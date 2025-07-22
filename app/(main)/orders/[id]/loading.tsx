// app/(main)/orders/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function OrderDetailLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <Skeleton className="h-8 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px] mb-1" />
                <Skeleton className="h-3 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Information Card */}
            <Card className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-[80px] mb-1" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-[80px] mb-1" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-[120px] mb-1" />
                <Skeleton className="h-4 w-[180px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4 pb-2 border-b">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  
                  {/* Table Rows */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-[80px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-[80%]" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Payment Summary */}
            <Card className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-[140px]" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-[130px]" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2 p-3 border rounded">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                    <Skeleton className="h-3 w-[140px]" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-[120px]" />
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}