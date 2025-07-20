// app/(main)/reports/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { SalesDetailReportResponse } from "@/lib/http-service/reports/types"

interface ReportExportButtonProps {
  data: SalesDetailReportResponse[]
  filename: string
}

export function ReportExportButton({ data, filename }: ReportExportButtonProps) {
  const headers = [
    "Date",
    "Product Name", 
    "Customer Name",
    "Width",
    "Length", 
    "Weight",
    "Quantity Sold",
    "Total",
    "Bill To Address",
    "Customer Phone",
    "Branch Name",
    "Payment Type",
    "Unit of Measure",
    "Dimensions",
    "Measurement",
    "Calculated Area"
  ]
  
  const exportData = data.map(item => ({
    date: item.date,
    productName: item.productName,
    customerName: item.customerName,
    width: item.width,
    length: item.length,
    weight: item.weight,
    quantitySold: item.quantitySold,
    total: item.total,
    billToAddress: item.billToAddress,
    customerPhoneNumber: item.customerPhoneNumber,
    branchName: item.branchName,
    paymentType: item.paymentType,
    unitOfMeasure: item.unitOfMeasure,
    dimensions: item.dimensions,
    measurement: item.measurement,
    calculatedArea: item.calculatedArea
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename={filename}
      headers={headers}
    />
  )
}
