// app/(main)/orders/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ShoppingCart, User, Calendar, CreditCard, Package } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getOrderAction } from "@/actions/orders"
import { Actions } from "../components/actions"
import { formatCurrency } from "@/lib/utils"

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const orderId = parseInt(params.id)

  if (isNaN(orderId)) {
    notFound()
  }

  // Fetch data server-side using existing action
  const orderResponse = await getOrderAction(orderId)
  
  if (!orderResponse.success || !orderResponse.data) {
    notFound()
  }

  const order = orderResponse.data

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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
                <Badge className={getOrderTypeColor(order.orderType)}>
                  {formatOrderType(order.orderType)}
                </Badge>
                <Badge className={getStatusColor(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{order.customerName}</span>
              </div>
            </div>
          </div>
          <Actions 
            orderId={order.id} 
            orderType={order.orderType}
            status={order.status}
            orderNumber={order.orderNumber}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(order.totalAmount)}</div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">{formatCurrency(order.paidAmount)}</div>
                <div className="text-sm text-muted-foreground">Paid Amount</div>
              </div>
              <div>
                <div className={`text-lg font-semibold ${order.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(order.balanceAmount)}
                </div>
                <div className="text-sm text-muted-foreground">Balance Due</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{order.customerName}</div>
                <div className="text-sm text-muted-foreground">Customer</div>
              </div>
              <div>
                <div className="font-medium">{order.branchName}</div>
                <div className="text-sm text-muted-foreground">Branch</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">
                  {new Date(order.createdDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Created Date</div>
              </div>
              {order.expectedCollectionDate && (
                <div>
                  <div className="font-medium">
                    {new Date(order.expectedCollectionDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Collection</div>
                </div>
              )}
              {order.completionDate && (
                <div>
                  <div className="font-medium">
                    {new Date(order.completionDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Date</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{order.orderItems?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div>
                <div className="font-medium">{order.payments?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Payments Made</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Length</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.productCode}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.length ? `${item.length}m` : '-'}
                        </TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                        <TableCell>{item.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payments */}
        {order.payments && order.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Received By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.paymentReference}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.paymentMethod.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{payment.receivedBy}</TableCell>
                        <TableCell>
                          <Badge variant={payment.reversed ? "destructive" : "default"}>
                            {payment.reversed ? "Reversed" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}