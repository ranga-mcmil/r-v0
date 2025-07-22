// app/(main)/orders/[id]/page.tsx
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, MoreHorizontal, Printer, Receipt, DollarSign, CreditCard } from "lucide-react"
import Link from "next/link"
import { getOrderAction, getOrderPaymentsAction } from "@/actions/orders"
import { formatCurrency } from "@/lib/utils"
import { OrderStatusBadge } from "../components/order-status-badge"
import { OrderTypeBadge } from "../components/order-type-badge"
import { OrderItemsTable } from "../components/order-items-table"
import { PaymentHistory } from "../components/payment-history"
import { OrderActions } from "../components/order-actions"
import { LayawayDetails } from "../components/layaway-details"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const orderId = parseInt(params.id)

  if (isNaN(orderId)) {
    notFound()
  }

  // Get session for role-based actions
  const session = await getServerSession(authOptions)
  
  if (!session) {
    notFound()
  }

  // Fetch order details and payments
  const [orderResponse, paymentsResponse] = await Promise.all([
    getOrderAction(orderId),
    getOrderPaymentsAction(orderId)
  ])

  if (!orderResponse.success || !orderResponse.data) {
    notFound()
  }

  const order = orderResponse.data
  const payments = paymentsResponse.success ? paymentsResponse.data : []

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
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Orders</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Created on {new Date(order.createdDate).toLocaleDateString()}</span>
                {order.referralName && (
                  <>
                    <span>•</span>
                    <span>Referred by {order.referralName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href={`/orders/${orderId}/print`}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Order
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={`/orders/${orderId}/receipt`}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Link>
                </DropdownMenuItem>
                
                {(order.orderType === 'QUOTATION' && order.status === 'PENDING') && (
                  <DropdownMenuItem asChild>
                    <Link href={`/orders/${orderId}/convert`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Convert Quotation
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {(order.orderType === 'LAYAWAY' && order.balanceAmount > 0) && (
                  <DropdownMenuItem asChild>
                    <Link href={`/orders/${orderId}/payment`}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Payment
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Primary Action based on order status */}
            <OrderActions order={order} />
          </div>
        </div>

        {/* Order Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getOrderTypeColor(order.orderType)}>
                {formatOrderType(order.orderType)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(order.status)}>
                {formatStatus(order.status)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(order.totalAmount)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Due</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${order.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(order.balanceAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Paid: {formatCurrency(order.paidAmount)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Customer & Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                    <p className="text-sm font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Branch</h4>
                    <p className="text-sm">{order.branchName}</p>
                  </div>
                  {order.expectedCollectionDate && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Expected Collection</h4>
                      <p className="text-sm">{new Date(order.expectedCollectionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Order Number</h4>
                    <p className="text-sm font-mono">{order.orderNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created Date</h4>
                    <p className="text-sm">{new Date(order.createdDate).toLocaleDateString()}</p>
                  </div>
                  {order.completionDate && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Completion Date</h4>
                      <p className="text-sm">{new Date(order.completionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''} in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderItemsTable items={order.orderItems} />
              </CardContent>
            </Card>

            {/* Layaway Details (if applicable) */}
            {order.orderType === 'LAYAWAY' && (
              <Suspense fallback={<div>Loading layaway details...</div>}>
                <LayawayDetails orderId={orderId} />
              </Suspense>
            )}

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Amount Paid</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(order.paidAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Balance Due</span>
                  <span className={`text-sm font-bold ${order.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(order.balanceAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            {payments && payments.length > 0 && (
              <PaymentHistory payments={payments} />
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/orders/${orderId}/print`}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Order
                  </Link>
                </Button>
                
                {order.orderType === 'LAYAWAY' && order.balanceAmount > 0 && (
                  <Button className="w-full" asChild>
                    <Link href={`/orders/${orderId}/payment`}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Payment
                    </Link>
                  </Button>
                )}
                
                {order.orderType === 'QUOTATION' && order.status === 'PENDING' && (
                  <Button className="w-full" asChild>
                    <Link href={`/orders/${orderId}/convert`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Convert to Order
                    </Link>
                  </Button>
                )}
                
                {order.status === 'READY_FOR_COLLECTION' && (
                  <Button className="w-full" asChild>
                    <Link href={`/orders/${orderId}/complete`}>
                      <Receipt className="mr-2 h-4 w-4" />
                      Complete Collection
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}