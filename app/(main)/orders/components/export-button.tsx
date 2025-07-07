// app/(main)/orders/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { OrderResponseDTO } from "@/lib/http-service/orders/types"

interface ExportButtonProps {
  orders: OrderResponseDTO[]
}

export function ExportButton({ orders }: ExportButtonProps) {
  const headers = [
    "Order Number", 
    "Customer", 
    "Type", 
    "Status", 
    "Total Amount", 
    "Paid Amount", 
    "Balance Amount", 
    "Branch", 
    "Created Date", 
    "Expected Collection Date",
    "Completion Date",
    "Notes"
  ]
  
  // Transform orders data to match headers
  const exportData = orders.map(order => ({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    orderType: order.orderType.replace(/_/g, ' '),
    status: order.status.replace(/_/g, ' '),
    totalAmount: order.totalAmount,
    paidAmount: order.paidAmount,
    balanceAmount: order.balanceAmount,
    branchName: order.branchName,
    createdDate: new Date(order.createdDate).toLocaleDateString(),
    expectedCollectionDate: order.expectedCollectionDate ? new Date(order.expectedCollectionDate).toLocaleDateString() : '',
    completionDate: order.completionDate ? new Date(order.completionDate).toLocaleDateString() : '',
    notes: order.notes || '',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="orders_export"
      headers={headers}
    />
  )
}