// app/(main)/dashboard/components/recent-sales-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import type { RecentSalesResponseDTO } from "@/lib/http-service/dashboard/types"

interface RecentSalesTableProps {
  recentSales: RecentSalesResponseDTO[]
}

export function RecentSalesTable({ recentSales = [] }: RecentSalesTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!recentSales || recentSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No recent sales found.
              </TableCell>
            </TableRow>
          ) : (
            recentSales.map((sale) => (
              <TableRow key={sale.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/orders/${sale.id}`} className="block hover:underline">
                    {sale.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/orders/${sale.id}`} className="block hover:underline">
                    {sale.orderType.replace('_', ' ')}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/orders/${sale.id}`} className="block hover:underline">
                    <Badge variant={getStatusVariant(sale.status)}>
                      {sale.status.replace('_', ' ')}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/orders/${sale.id}`} className="block hover:underline">
                    {formatCurrency(sale.paidAmount)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/orders/${sale.id}`} className="block hover:underline">
                    {formatDate(sale.transactionTime)}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}