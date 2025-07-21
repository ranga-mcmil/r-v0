// app/(main)/reports/components/pagination-controls.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationControlsProps {
  pagination: {
    totalElements: number
    totalPages: number
    pageNo: number
    pageSize: number
    last: boolean
  }
  currentDate: string
}

export function PaginationControls({ pagination, currentDate }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNo: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pageNo', pageNo.toString())
    params.set('date', currentDate)
    return `/reports?${params.toString()}`
  }

  const startIndex = pagination.pageNo * pagination.pageSize
  const endIndex = Math.min(startIndex + pagination.pageSize, pagination.totalElements)

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Showing {startIndex + 1} to {endIndex} of {pagination.totalElements} results
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageURL(pagination.pageNo - 1))}
          disabled={pagination.pageNo === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm">
          Page {pagination.pageNo + 1} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageURL(pagination.pageNo + 1))}
          disabled={pagination.last}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
