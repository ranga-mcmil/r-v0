"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"

export function UsersFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current filter values from URL
  const currentSearch = searchParams.get("search") || ""
  const currentRole = searchParams.get("role") || "all"
  const currentStatus = searchParams.get("status") || "all"
  const currentFromDate = searchParams.get("fromDate") || undefined
  const currentToDate = searchParams.get("toDate") || undefined

  // Local state for form inputs
  const [search, setSearch] = useState(currentSearch)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: currentFromDate ? new Date(currentFromDate) : undefined,
    to: currentToDate ? new Date(currentToDate) : undefined,
  })

  // Update URL when filters change
  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove params based on values
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Reset to page 1 when filters change
    params.delete("page")

    // Navigate to new URL
    router.push(`/users?${params.toString()}`)
  }

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search })
  }

  // Handle role change
  const handleRoleChange = (value: string) => {
    updateFilters({ role: value })
  }

  // Handle status change
  const handleStatusChange = (value: string) => {
    updateFilters({ status: value })
  }

  // Handle date range change
  useEffect(() => {
    if (dateRange.from || dateRange.to) {
      updateFilters({
        fromDate: dateRange.from?.toISOString().split("T")[0],
        toDate: dateRange.to?.toISOString().split("T")[0],
      })
    }
  }, [dateRange])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className="flex flex-col gap-2 md:flex-row">
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        <Select value={currentRole} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="store_manager">Store Manager</SelectItem>
            <SelectItem value="sales_rep">Sales Rep</SelectItem>
          </SelectContent>
        </Select>
        <Select value={currentStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
