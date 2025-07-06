"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersFilters } from "./users-filters"
import { UsersStats } from "./users-stats"
import { UsersTable } from "./users-table"
import { ExportButton } from "./export-button"
import type { User } from "@/lib/types"

interface UsersPageClientProps {
  users: User[]
  totalUsers: number
  activeUsers: number
  adminCount: number
  managerCount: number
  salesRepCount: number
  currentPage: number
  totalPages: number
  sortField: string
  sortDirection: "asc" | "desc"
  baseUrl: string
  search: string
  role: string
  status: string
  fromDate?: string
  toDate?: string
}

export function UsersPageClient({
  users,
  totalUsers,
  activeUsers,
  adminCount,
  managerCount,
  salesRepCount,
  currentPage,
  totalPages,
  sortField,
  sortDirection,
  baseUrl,
  search,
  role,
  status,
  fromDate,
  toDate,
}: UsersPageClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <div className="flex items-center gap-2">
            <ExportButton
              search={search}
              role={role !== "all" ? role : undefined}
              status={status !== "all" ? status : undefined}
              fromDate={fromDate}
              toDate={toDate}
            />
            <Button asChild>
              <Link href="/users/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <div className="border rounded-lg p-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
                <Skeleton className="h-10 flex-1" />
                <div className="flex flex-col gap-2 md:flex-row">
                  <Skeleton className="h-10 w-[300px]" />
                  <Skeleton className="h-10 w-[180px]" />
                  <Skeleton className="h-10 w-[180px]" />
                </div>
              </div>
              <TableSkeleton columnCount={7} rowCount={10} />
            </div>
          </>
        ) : (
          <>
            <UsersStats
              totalUsers={totalUsers}
              activeUsers={activeUsers}
              adminCount={adminCount}
              managerCount={managerCount}
              salesRepCount={salesRepCount}
              filteredCount={totalUsers}
            />
            <div className="border rounded-lg p-2">
              <UsersFilters />
              <UsersTable
                users={users}
                currentPage={currentPage}
                totalPages={totalPages}
                sortField={sortField}
                sortDirection={sortDirection}
                baseUrl={baseUrl}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
