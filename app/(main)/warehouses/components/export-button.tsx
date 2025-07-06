import { ExportButton } from "@/components/actions/export-button"
import type { Warehouse } from "@/lib/types"
import { users } from "@/lib/dummy-data"

interface WarehouseExportButtonProps {
  warehouses: Warehouse[]
}

export function WarehouseExportButton({ warehouses }: WarehouseExportButtonProps) {
  const headers = ["Name", "Location", "Status", "Assigned Users"]
  
  // Transform warehouses data to match headers
  const exportData = warehouses.map(warehouse => ({
    name: warehouse.name,
    location: warehouse.location,
    status: warehouse.status,
    assignedUsers: users.filter(user => user.warehouseId === warehouse.id).length,
  }))

  return (
    <ExportButton
      data={exportData}
      filename="warehouses_export"
      headers={headers}
    />
  )
}