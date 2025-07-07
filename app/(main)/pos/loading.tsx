// app/(main)/pos/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function POSLoading() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <main className="flex flex-1 h-full">
        {/* Products Section - Left Side */}
        <div className="flex-1 border-r flex flex-col h-full">
          {/* Fixed Header */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Skeleton className="h-7 w-[180px] mb-2" />
                <Skeleton className="h-4 w-[220px]" />
              </div>
            </div>

            <div className="relative mb-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Product Tabs */}
          <div className="px-4 md:px-6">
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-8 w-[70px]" />
              <Skeleton className="h-8 w-[90px]" />
            </div>

            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[2/1] relative bg-muted">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-5 w-16" />
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col h-full">
          {/* Fixed Cart Header */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>

            {/* Order Type Selection */}
            <div className="mb-4">
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 md:px-6">
            {/* Cart Items */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="text-center py-6 text-muted-foreground">
                  <Skeleton className="h-4 w-[120px] mx-auto" />
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[80px] mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-[60px] mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>

              {/* Order Summary */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[40px]" />
                  <Skeleton className="h-4 w-[60px]" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-[50px]" />
                  <Skeleton className="h-5 w-[90px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-4 md:p-6 border-t mt-auto">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </main>
    </div>
  )
}