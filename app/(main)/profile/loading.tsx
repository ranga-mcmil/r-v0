// app/(main)/profile/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar skeleton */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>

                <div className="border-t border-border my-4"></div>

                <div className="space-y-4 pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="w-full md:w-2/3">
          <Skeleton className="h-10 w-48 mb-6" />
          
          {/* Tabs skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            
            {/* Personal Info Form Card skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
            
            {/* Password Form Card skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex justify-start">
                  <Skeleton className="h-10 w-36" />
                </div>
              </CardContent>
            </Card>

            {/* Security/2FA Card skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-16" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-36 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-16" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}