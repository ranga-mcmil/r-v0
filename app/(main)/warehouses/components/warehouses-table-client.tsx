
// app/(main)/warehouses/components/warehouses-table-client.tsx
"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface SortLinkProps {
  field: string
  currentSortField: string
  currentSortDirection: "asc" | "desc"
  children: React.ReactNode
}

export function SortLink({ field, currentSortField, currentSortDirection, children }: SortLinkProps) {
  const searchParams = useSearchParams()
  
  const createSortURL = (sortField: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (currentSortField === sortField) {
      params.set("sortField", sortField)
      params.set("sortDirection", currentSortDirection === "asc" ? "desc" : "asc")
    } else {
      params.set("sortField", sortField)
      params.set("sortDirection", "asc")
    }

    return `/warehouses?${params.toString()}`
  }

  return (
    <Link href={createSortURL(field)} className="flex items-center hover:underline">
      {children}
      {currentSortField === field && (
        <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
      )}
    </Link>
  )
}

export function PaginationLink({ page, children, className, ...props }: {
  page: number | string
  children: React.ReactNode
  className?: string
  "aria-disabled"?: boolean
  tabIndex?: number
}) {
  const searchParams = useSearchParams()
  
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `/warehouses?${params.toString()}`
  }

  return (
    <Link href={createPageURL(page)} className={className} {...props}>
      {children}
    </Link>
  )
}
