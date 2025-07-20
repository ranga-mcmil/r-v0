// app/(main)/reports/sales-detail/components/sales-detail-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import type { SalesDetailReportResponse } from "@/lib/http-service/reports/types"

interface SalesDetailTableProps {
  data: SalesDetailReportResponse[]
}

export function SalesDetailTable({ data }: SalesDetailTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No sales data found for the selected period.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.dimensions}</TableCell>
                  <TableCell>{item.quantitySold}</TableCell>
                  <TableCell>{formatCurrency(item.total)}</TableCell>
                  <TableCell>{item.branchName}</TableCell>
                  <TableCell>{item.paymentType}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}