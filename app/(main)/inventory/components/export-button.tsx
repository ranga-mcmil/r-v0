// app/(main)/inventory/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { InventoryDTO } from "@/lib/http-service/inventory/types"

interface ExportButtonProps {
  inventory: InventoryDTO[]
}

export function ExportButton({ inventory }: ExportButtonProps) {
  const headers = ["ID", "Product", "Batch", "Quantity", "Length", "Width", "Weight", "Total Stock", "Date", "Remarks"]
  
  // Transform inventory data to match headers
  const exportData = inventory.map(item => ({
    id: item.id,
    productName: item.productName,
    batchNumber: item.batchNumber,
    quantity: item.quantity,
    length: item.length || '',
    width: item.width || '',
    weight: item.weight || '',
    totalStockQuantity: item.totalStockQuantity,
    createdAt: new Date(item.createdAt).toLocaleDateString(),
    remarks: item.remarks || '',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="inventory_export"
      headers={headers}
    />
  )
}