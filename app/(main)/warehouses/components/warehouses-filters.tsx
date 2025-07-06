// Updated warehouse filters using generic component  
// app/(main)/warehouses/components/warehouses-filters.tsx
import { DataTableFilters } from "@/components/data-table/data-table-filters"

interface WarehousesFiltersProps {
  currentSearch: string
  currentStatus: string
}

export function WarehousesFilters({ currentSearch, currentStatus }: WarehousesFiltersProps) {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]

  return (
    <DataTableFilters
      currentSearch={currentSearch}
      currentStatus={currentStatus}
      statusOptions={statusOptions}
      searchPlaceholder="Search warehouses..."
      statusLabel="Status"
    />
  )
}
