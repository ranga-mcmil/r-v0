// Updated status change button using generic component
// app/(main)/warehouses/components/status-change-button.tsx
import { StatusToggle } from "@/components/actions/status-toggle"

interface StatusChangeButtonProps {
  warehouseId: string
  currentStatus: "active" | "inactive"
  warehouseName: string
}

export function StatusChangeButton({ warehouseId, currentStatus }: StatusChangeButtonProps) {
  return (
    <StatusToggle
      itemId={warehouseId}
      currentStatus={currentStatus}
      baseUrl="/warehouses"
      activeStatus="active"
      inactiveStatus="inactive"
    />
  )
}