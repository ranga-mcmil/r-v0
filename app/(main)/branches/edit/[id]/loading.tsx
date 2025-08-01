// app/(main)/branches/edit/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function BranchFormLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Skeleton className="h-7 w-[200px] mb-1" />
            <Skeleton className="h-4 w-[220px]" />
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-[150px]" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Skeleton className="h-10 w-[80px]" />
              <Skeleton className="h-10 w-[140px]" />
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
