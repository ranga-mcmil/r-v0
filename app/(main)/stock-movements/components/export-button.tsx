// app/(main)/stock-movements/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { StockMovementDTO } from "@/lib/http-service/stock-movements/types"

interface ExportButtonProps {
  movements: StockMovementDTO[]
}

export function ExportButton({ movements }: ExportButtonProps) {
  const headers = ["ID", "Product", "Order", "Quantity", "Stock Before", "Stock After", "Movement Type", "Date", "Created By", "Reversed"]
  
  const exportData = movements.map(movement => ({
    id: movement.id,
    productName: movement.productName,
    orderNumber: movement.orderNumber,
    quantity: movement.quantity,
    stockBefore: movement.stockBefore,
    stockAfter: movement.stockAfter,
    movementType: movement.movementType,
    movementDate: new Date(movement.movementDate).toLocaleDateString(),
    createdByName: movement.createdByName,
    reversed: movement.reversed ? 'Yes' : 'No',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="stock_movements_export"
      headers={headers}
    />
  )
}
