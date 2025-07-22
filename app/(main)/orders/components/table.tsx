// app/(main)/orders/components/table.tsx (Updated)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight, CreditCard, CheckCircle, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { OrderResponseDTO } from "@/lib/http-service/orders/types"

interface OrdersTableProps {
  orders: OrderResponseDTO[]
  totalPages: number
  currentPage: number
  totalElements: number
  baseUrl: string
  showConvertActions?: boolean
  showPaymentActions?: boolean
  showCollectionActions?: boolean
  highlightOverdue?: boolean
}

export function OrdersTable({ 
  orders = [], 
  totalPages, 
  currentPage, 
  totalElements,
  baseUrl,
  showConvertActions = false,
  showPaymentActions = false,
  showCollectionActions = false,
  highlightOverdue = false
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

  const isOrderOverdue = (order: OrderResponseDTO) => {
    if (!highlightOverdue) return false
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    // For ready for collection orders
    if (order.status === 'READY_FOR_COLLECTION') {
      return new Date(order.createdDate) < sevenDaysAgo
    }
    
    // For layaway orders - check if they have overdue payments
    if (order.orderType === 'LAYAWAY' && order.status === 'PARTIALLY_PAID') {
      // This would need actual payment due date logic
      return new Date(order.createdDate) < sevenDaysAgo
    }
    
    return false
  }

  const buildPaginationUrl = (page: number) => {
    const url = new URL(baseUrl, 'http://localhost')
    url.searchParams.set('page', page.toString())
    return url.pathname + url.search
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
              {(showConvertActions || showPaymentActions || showCollectionActions) && (
                <TableHead>Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!orders || orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showConvertActions || showPaymentActions || showCollectionActions ? 10 : 9} className="text-center py-8 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const isOverdue = isOrderOverdue(order)
                return (
                  <TableRow 
                    key={order.id} 
                    className={`cursor-pointer hover:bg-muted/50 ${isOverdue ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}
                  >
                    <TableCell className="font-medium">
                      <Link href={`/orders/${order.id}`} className="block hover:underline">
                        <div className="flex items-center gap-2">
                          {order.orderNumber}
                          {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
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
                    
                    {/* Action buttons column */}
                    {(showConvertActions || showPaymentActions || showCollectionActions) && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {showConvertActions && order.orderType === 'QUOTATION' && order.status === 'PENDING' && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/orders/${order.id}/convert`}>
                                <ArrowRight className="h-3 w-3 mr-1" />
                                Convert
                              </Link>
                            </Button>
                          )}
                          
                          {showPaymentActions && order.orderType === 'LAYAWAY' && order.balanceAmount > 0 && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/orders/${order.id}/payment`}>
                                <CreditCard className="h-3 w-3 mr-1" />
                                Pay
                              </Link>
                            </Button>
                          )}
                          
                          {showCollectionActions && order.status === 'READY_FOR_COLLECTION' && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/orders/${order.id}`}>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complete
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
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
                <Link href={buildPaginationUrl(currentPage - 1)}>
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
                    <Link href={buildPaginationUrl(page)}>
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
                <Link href={buildPaginationUrl(currentPage + 1)}>
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