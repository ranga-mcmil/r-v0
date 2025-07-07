// app/(main)/orders/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { OrderResponseDTO } from "@/lib/http-service/orders/types"

interface OrdersTableProps {
  orders: OrderResponseDTO[]
  totalPages: number
  currentPage: number
  totalElements: number
}

export function OrdersTable({ 
  orders = [], 
  totalPages, 
  currentPage, 
  totalElements 
}: OrdersTableProps) {
  
  const getOrderTypeColor = (orderType: string) => {
    switch (orderType) {
      case 'QUOTATION':
        return 'bg-blue-100 text-blue-800'
      case 'IMMEDIATE_SALE':
        return 'bg-green-100 text-green-800'
      case 'FUTURE_COLLECTION':
        return 'bg-purple-100 text-purple-800'
      case 'LAYAWAY':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CONFIRMED':
      case 'FULLY_PAID':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PARTIALLY_PAID':
        return 'bg-orange-100 text-orange-800'
      case 'READY_FOR_COLLECTION':
        return 'bg-purple-100 text-purple-800'
      case 'CANCELLED':
      case 'REVERSED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatOrderType = (orderType: string) => {
    return orderType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!orders || orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      {order.customerName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      <Badge className={getOrderTypeColor(order.orderType)}>
                        {formatOrderType(order.orderType)}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      <Badge className={getStatusColor(order.status)}>
                        {formatStatus(order.status)}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      {formatCurrency(order.totalAmount)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      <span className={order.paidAmount > 0 ? "text-green-600" : ""}>
                        {formatCurrency(order.paidAmount)}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      <span className={order.balanceAmount > 0 ? "text-red-600" : "text-green-600"}>
                        {formatCurrency(order.balanceAmount)}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      {order.branchName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="block hover:underline">
                      {new Date(order.createdDate).toLocaleDateString()}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {orders.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalElements)} of {totalElements} orders
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild={currentPage > 1}
              disabled={currentPage <= 1}
            >
              {currentPage > 1 ? (
                <Link href={`/orders?page=${currentPage - 1}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </>
              )}
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={`/orders?page=${page}`}>
                      {page}
                    </Link>
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              asChild={currentPage < totalPages}
              disabled={currentPage >= totalPages}
            >
              {currentPage < totalPages ? (
                <Link href={`/orders?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}