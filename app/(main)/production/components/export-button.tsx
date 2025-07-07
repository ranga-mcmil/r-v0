// app/(main)/production/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { ProductionDTO } from "@/lib/http-service/productions/types"

interface ExportButtonProps {
  productions: ProductionDTO[]
}

export function ExportButton({ productions }: ExportButtonProps) {
  const headers = ["ID", "Order Number", "Batch Number", "Quantity", "Remarks", "Created Date"]
  
  const exportData = productions.map(production => ({
    id: production.id,
    orderNumber: production.orderNumber,
    inventoryBatchNumber: production.inventoryBatchNumber,
    quantity: production.quantity,
    remarks: production.remarks || '',
    createdAt: new Date(production.createdAt).toLocaleDateString(),
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="production_export"
      headers={headers}
    />
  )
}
