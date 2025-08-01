// app/(main)/reports/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { SalesDetailReportResponse } from "@/lib/http-service/reports/types"

interface ExportButtonProps {
  reports: SalesDetailReportResponse[]
  currentDate: string
}

export function ExportButton({ reports, currentDate }: ExportButtonProps) {
  const headers = [
    "Date", "Product Name", "Customer Name", "Branch Name", 
    "Quantity Sold", "Width", "Length", "Weight", "Total", 
    "Bill To Address", "Phone Number", "Payment Type", 
    "Unit of Measure", "Dimensions", "Calculated Area"
  ]
  
  // Transform reports data to match headers
  const exportData = reports.map(report => ({
    date: report.date,
    productName: report.productName,
    customerName: report.customerName,
    branchName: report.branchName,
    quantitySold: report.quantitySold,
    width: report.width,
    length: report.length,
    weight: report.weight,
    total: report.total,
    billToAddress: report.billToAddress,
    phoneNumber: report.customerPhoneNumber,
    paymentType: report.paymentType,
    unitOfMeasure: report.unitOfMeasure,
    dimensions: report.dimensions,
    calculatedArea: report.calculatedArea,
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename={`sales_report_${currentDate}`}
      headers={headers}
    />
  )
}
