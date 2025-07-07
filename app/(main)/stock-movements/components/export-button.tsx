// app/(main)/stock-movements/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { StockMovementDTO } from "@/lib/http-service/stock-movements/types"

interface ExportButtonProps {
  stockMovements: StockMovementDTO[]
}

export function ExportButton({ stockMovements }: ExportButtonProps) {
  const headers = [
    "ID", 
    "Product", 
    "Order Number", 
    "Movement Type", 
    "Quantity", 
    "Stock Before", 
    "Stock After", 
    "Created By", 
    "Movement Date", 
    "Notes", 
    "Reversed", 
    "Reversed Date"
  ]
  
  // Transform stock movements data to match headers
  const exportData = stockMovements.map(movement => ({
    id: movement.id,
    productName: movement.productName,
    orderNumber: movement.orderNumber || '',
    movementType: movement.movementType.replace(/_/g, ' '),
    quantity: movement.quantity,
    stockBefore: movement.stockBefore,
    stockAfter: movement.stockAfter,
    createdByName: movement.createdByName,
    movementDate: new Date(movement.movementDate).toLocaleString(),
    notes: movement.notes || '',
    reversed: movement.reversed ? 'Yes' : 'No',
    reversedDate: movement.reversedDate ? new Date(movement.reversedDate).toLocaleString() : '',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="stock_movements_export"
      headers={headers}
    />
  )
}