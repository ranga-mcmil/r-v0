import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar } from "lucide-react"
import { warehouses, users } from "@/lib/dummy-data"
import { WarehousesTable } from "./components/warehouses-table"
import { WarehousesFilters } from "./components/warehouses-filters"

interface WarehousesPageProps {
  searchParams: {
    search?: string
    status?: string
    sortField?: string
    sortDirection?: "asc" | "desc"
    page?: string
  }
}

export default function WarehousesPage({ searchParams }: WarehousesPageProps) {
  // Parse search params
  const search = searchParams.search || ""
  const status = searchParams.status || "all"
  const sortField = searchParams.sortField || "name"
  const sortDirection = (searchParams.sortDirection || "asc") as "asc" | "desc"
  const page = Number.parseInt(searchParams.page || "1", 10)
  const itemsPerPage = 2


  // Calculate pagination
  const totalItems = warehouses.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWarehouses = warehouses.slice(startIndex, endIndex)

  // Calculate stats
  const totalWarehouses = warehouses.length
  const activeWarehouses = warehouses.filter((warehouse) => warehouse.status === "active").length
  const inactiveWarehouses = warehouses.filter((warehouse) => warehouse.status === "inactive").length
  const totalUsers = warehouses.reduce((sum, warehouse) => {
    return sum + users.filter((user) => user.warehouseId === warehouse.id).length
  }, 0)

  // Pre-compute user counts for each warehouse
  const userCounts: Record<string, number> = {}
  for (const warehouse of paginatedWarehouses) {
    userCounts[warehouse.id] = users.filter((user) => user.warehouseId === warehouse.id).length
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Warehouses</h1>
            <p className="text-muted-foreground">Manage and track your warehouses</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/warehouses/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            <Button asChild>
              <Link href="/warehouses/create">
                <Plus className="mr-2 h-4 w-4" /> New Warehouse
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWarehouses}</div>
              <p className="text-xs text-muted-foreground">
                {warehouses.length === warehouses.length
                  ? "All warehouses"
                  : `Filtered from ${warehouses.length} total`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWarehouses}</div>
              <p className="text-xs text-muted-foreground">Ready for operations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Warehouses</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveWarehouses}</div>
              <p className="text-xs text-muted-foreground">Not currently in use</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Total users assigned</p>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg p-2">
          <WarehousesFilters currentSearch={search} currentStatus={status} />

          <WarehousesTable
            warehouses={paginatedWarehouses}
            userCounts={userCounts}
            pagination={{
              totalItems,
              totalPages,
              currentPage: page,
              itemsPerPage,
              startIndex,
              endIndex: Math.min(endIndex, totalItems),
            }}
            currentSortField={sortField}
            currentSortDirection={sortDirection}
          />
        </div>
      </main>
    </div>
  )
}
