// Updated warehouse table using generic components
// app/(main)/warehouses/components/warehouses-table.tsx
import { Badge } from "@/components/ui/badge"
import { DataTable, Column } from "@/components/data-table/data-table"
import { users } from "@/lib/dummy-data"
import type { Warehouse } from "@/lib/types"

interface WarehousesTableProps {
  warehouses: Warehouse[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }
  currentSortField: string
  currentSortDirection: "asc" | "desc"
}

export function WarehousesTable({
  warehouses,
  pagination,
  currentSortField,
  currentSortDirection,
}: WarehousesTableProps) {
  
  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Inactive
      </Badge>
    )
  }

  const getUserCount = (warehouseId: string) => {
    return users.filter((user) => user.warehouseId === warehouseId).length
  }

  const columns: Column<Warehouse>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "location", 
      label: "Location",
      sortable: true,
    },
    {
      key: "status",
      label: "Status", 
      sortable: true,
      render: (status) => getStatusBadge(status),
    },
    {
      key: "id",
      label: "Assigned Users",
      render: (_, warehouse) => getUserCount(warehouse.id),
    },
  ]

  return (
    <DataTable
      data={warehouses}
      columns={columns}
      pagination={pagination}
      currentSortField={currentSortField}
      currentSortDirection={currentSortDirection}
      baseUrl="/warehouses"
      getItemId={(warehouse) => warehouse.id}
      emptyMessage="No warehouses found. Try adjusting your filters."
    />
  )
}
