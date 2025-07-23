// app/(main)/reports/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import type { SalesDetailReportResponse } from "@/lib/http-service/reports/types"
import { PaginationControls } from "./pagination-controls"

interface ReportsTableProps {
  reports: SalesDetailReportResponse[]
  pagination: {
    totalElements: number
    totalPages: number
    pageNo: number
    pageSize: number
    last: boolean
  }
  currentDate: string
}

export function ReportsTable({ reports, pagination, currentDate }: ReportsTableProps) {
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!reports || reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No sales data found for the selected date.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.productName}</TableCell>
                  <TableCell>{report.customerName}</TableCell>
                  <TableCell>{report.branchName}</TableCell>
                  <TableCell>
                    {report.quantitySold} {report.unitOfMeasure}
                  </TableCell>
                  <TableCell>
                    {report.length > 0 ? `${report.length}m` : '-'}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{report.paymentType?.toLowerCase()}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(report.total)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {reports && reports.length > 0 && (
        <PaginationControls 
          pagination={pagination}
          currentDate={currentDate}
        />
      )}
    </>
  )
}