// app/(main)/reports/date-range/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { SalesDetailReportResponse } from "@/lib/http-service/reports/types"

interface DateRangeExportButtonProps {
  reports: SalesDetailReportResponse[]
  startDate: string
  endDate: string
}

export function DateRangeExportButton({ reports, startDate, endDate }: DateRangeExportButtonProps) {
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
      filename={`sales_report_${startDate}_to_${endDate}`}
      headers={headers}
    />
  )
}