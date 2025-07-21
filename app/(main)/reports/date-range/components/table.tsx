// app/(main)/reports/date-range/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, Calendar } from "lucide-react"
import type { SalesDetailReportResponse } from "@/lib/http-service/reports/types"

interface DateRangeReportsTableProps {
  reports: SalesDetailReportResponse[]
  startDate: string
  endDate: string
  dailyBreakdown: Record<string, { orders: number; sales: number }>
}

export function DateRangeReportsTable({ 
  reports, 
  startDate, 
  endDate,
  dailyBreakdown 
}: DateRangeReportsTableProps) {
  return (
    <div className="space-y-6">
      {/* Daily Summary Cards */}
      {Object.keys(dailyBreakdown).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Breakdown
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(dailyBreakdown)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, data]) => (
                <Card key={date}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {new Date(date).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Orders:</span>
                        <span className="text-sm font-medium">{data.orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sales:</span>
                        <span className="text-sm font-medium">{formatCurrency(data.sales)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Detailed Reports Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Detailed Sales Data
        </h3>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!reports || reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No sales data found for the selected date range.
                  </TableCell>
                </TableRow>
              ) : (
                reports
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((report, index) => (
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
                        {report.dimensions || `${report.length}×${report.width}`}
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
      </div>
    </div>
  )
}
