// app/(main)/orders/components/export-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { OrderResponseDTO, OrderListResponseDTO } from "@/lib/http-service/orders/types"

interface OrderExportButtonProps {
  orders: OrderResponseDTO[] | OrderListResponseDTO[]
  filename: string
  className?: string
}

export function ExportButton({ orders, filename, className }: OrderExportButtonProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const exportCSV = () => {
    setIsExporting(true)

    try {
      // Define headers for order export
      const headers = [
        "Order Number",
        "Order Type", 
        "Status",
        "Customer Name",
        "Branch Name",
        "Referral Name",
        "Total Amount",
        "Paid Amount",
        "Balance Amount",
        "Created Date",
        "Expected Collection Date",
        "Completion Date",
        "Notes"
      ]

      // Transform orders data to match headers
      const exportData = orders.map(order => [
        order.orderNumber,
        order.orderType.replace(/_/g, ' '),
        order.status.replace(/_/g, ' '),
        order.customerName,
        order.branchName,
        order.referralName || '',
        order.totalAmount.toFixed(2),
        order.paidAmount.toFixed(2),
        order.balanceAmount.toFixed(2),
        new Date(order.createdDate).toLocaleDateString(),
        order.expectedCollectionDate ? new Date(order.expectedCollectionDate).toLocaleDateString() : '',
        order.completionDate ? new Date(order.completionDate).toLocaleDateString() : '',
        order.notes || ''
      ])

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...exportData.map(row => 
          row.map(field => 
            // Escape fields that contain commas, quotes, or newlines
            typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(",")
        )
      ].join("\n")

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Clean up

      toast({
        title: "Export successful",
        description: `${orders.length} orders exported to CSV`,
      })
    } catch (error) {
      console.error("Error exporting orders:", error)
      toast({
        title: "Export failed",
        description: "An error occurred while exporting orders",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={exportCSV} 
      disabled={isExporting || orders.length === 0} 
      className={className}
    >
      <Download className="mr-2 h-4 w-4" /> 
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  )
}