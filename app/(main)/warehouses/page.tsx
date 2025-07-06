// app/(main)/warehouses/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { WarehousesTable } from "./components/warehouses-table"
import { WarehousesFilters } from "./components/warehouses-filters"
import { WarehousesStats } from "./components/warehouses-stats"
import { WarehouseExportButton } from "./components/export-button"
import { getWarehouses, getWarehouseStats } from "./actions"

interface WarehousesPageProps {
  searchParams: {
    search?: string
    status?: string
    sortField?: string
    sortDirection?: "asc" | "desc"
    page?: string
  }
}

export default async function WarehousesPage({ searchParams }: WarehousesPageProps) {
  // Parse search params
  const search = searchParams.search || ""
  const status = searchParams.status || "all"
  const sortField = searchParams.sortField || "name"
  const sortDirection = (searchParams.sortDirection || "asc") as "asc" | "desc"
  const page = Number.parseInt(searchParams.page || "1", 10)
  const itemsPerPage = 10

  // Fetch data server-side
  const [warehousesData, stats] = await Promise.all([
    getWarehouses({
      search,
      status,
      sortField,
      sortDirection,
      page,
      itemsPerPage,
    }),
    getWarehouseStats()
  ])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Warehouses</h1>
            <p className="text-muted-foreground">Manage and track your warehouses</p>
          </div>
          <div className="flex gap-2">
            <WarehouseExportButton warehouses={warehousesData.warehouses} />
            <Button asChild>
              <Link href="/warehouses/create">
                <Plus className="mr-2 h-4 w-4" /> New Warehouse
              </Link>
            </Button>
          </div>
        </div>

        <WarehousesStats
          totalWarehouses={stats.totalWarehouses}
          activeWarehouses={stats.activeWarehouses}
          inactiveWarehouses={stats.inactiveWarehouses}
          totalUsers={stats.totalUsers}
          filteredCount={warehousesData.pagination.totalItems}
        />

        <div className="border rounded-lg p-2">
          <WarehousesFilters currentSearch={search} currentStatus={status} />
          <WarehousesTable
            warehouses={warehousesData.warehouses}
            pagination={warehousesData.pagination}
            currentSortField={sortField}
            currentSortDirection={sortDirection}
          />
        </div>
      </main>
    </div>
  )
}
