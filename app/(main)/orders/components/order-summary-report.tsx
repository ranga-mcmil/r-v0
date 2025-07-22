// app/(main)/orders/components/order-summary-report.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getAllOrdersAction } from "@/actions/orders"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, FileText, CreditCard, Package, CheckCircle, AlertTriangle, Clock } from "lucide-react"

interface OrderSummaryReportProps {
  searchParams?: {
    startDate?: string
    endDate?: string
    branchId?: string
  }
}

export async function OrderSummaryReport({ searchParams }: OrderSummaryReportProps) {
  // Calculate date range (default to current month if not specified)
  const endDate = searchParams?.endDate || new Date().toISOString().split('T')[0]
  const startDate = searchParams?.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  // Fetch orders data for the specified period
  let orders: any[] = []
  let stats = {
    totalOrders: 0,
    totalValue: 0,
    averageOrderValue: 0,
    quotations: { count: 0, value: 0, conversionRate: 0 },
    immediateSales: { count: 0, value: 0 },
    layaway: { count: 0, value: 0, activeCount: 0, completedCount: 0 },
    futureCollection: { count: 0, value: 0 },
    statusBreakdown: {
      pending: 0,
      confirmed: 0,
      partiallyPaid: 0,
      fullyPaid: 0,
      readyForCollection: 0,
      completed: 0,
      cancelled: 0,
      reversed: 0
    },
    paymentProgress: 0,
    collectionEfficiency: 0
  }

  try {
    const ordersResponse = await getAllOrdersAction({
      pageSize: 1000, // Get more data for comprehensive analysis
      startDate,
      endDate,
      ...(searchParams?.branchId && { branchId: searchParams.branchId })
    })
    
    if (ordersResponse.success && ordersResponse.data) {
      orders = ordersResponse.data.content
      
      // Calculate comprehensive statistics
      stats.totalOrders = orders.length
      stats.totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
      stats.averageOrderValue = stats.totalOrders > 0 ? stats.totalValue / stats.totalOrders : 0

      // Order type breakdown
      const quotations = orders.filter(o => o.orderType === 'QUOTATION')
      const immediateSales = orders.filter(o => o.orderType === 'IMMEDIATE_SALE')
      const layawayOrders = orders.filter(o => o.orderType === 'LAYAWAY')
      const futureCollectionOrders = orders.filter(o => o.orderType === 'FUTURE_COLLECTION')

      stats.quotations = {
        count: quotations.length,
        value: quotations.reduce((sum, order) => sum + order.totalAmount, 0),
        conversionRate: quotations.length > 0 ? 
          (quotations.filter(q => q.status !== 'PENDING').length / quotations.length) * 100 : 0
      }

      stats.immediateSales = {
        count: immediateSales.length,
        value: immediateSales.reduce((sum, order) => sum + order.totalAmount, 0)
      }

      stats.layaway = {
        count: layawayOrders.length,
        value: layawayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        activeCount: layawayOrders.filter(o => ['CONFIRMED', 'PARTIALLY_PAID'].includes(o.status)).length,
        completedCount: layawayOrders.filter(o => o.status === 'COMPLETED').length
      }

      stats.futureCollection = {
        count: futureCollectionOrders.length,
        value: futureCollectionOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      }

      // Status breakdown
      stats.statusBreakdown = {
        pending: orders.filter(o => o.status === 'PENDING').length,
        confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
        partiallyPaid: orders.filter(o => o.status === 'PARTIALLY_PAID').length,
        fullyPaid: orders.filter(o => o.status === 'FULLY_PAID').length,
        readyForCollection: orders.filter(o => o.status === 'READY_FOR_COLLECTION').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length,
        reversed: orders.filter(o => o.status === 'REVERSED').length
      }

      // Calculate payment progress
      const totalPaid = orders.reduce((sum, order) => sum + order.paidAmount, 0)
      stats.paymentProgress = stats.totalValue > 0 ? (totalPaid / stats.totalValue) * 100 : 0

      // Calculate collection efficiency
      const readyOrders = orders.filter(o => o.status === 'READY_FOR_COLLECTION')
      const completedOrders = orders.filter(o => o.status === 'COMPLETED')
      stats.collectionEfficiency = (readyOrders.length + completedOrders.length) > 0 ? 
        (completedOrders.length / (readyOrders.length + completedOrders.length)) * 100 : 0
    }
  } catch (error) {
    console.error('Error fetching orders for summary:', error)
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {startDate} to {endDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(stats.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paymentProgress.toFixed(1)}%</div>
            <Progress value={stats.paymentProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collectionEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Ready orders collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Types</CardTitle>
            <CardDescription>Distribution by order type and value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Quotations</span>
                <Badge variant="secondary">{stats.quotations.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(stats.quotations.value)}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.quotations.conversionRate.toFixed(1)}% conversion
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Immediate Sales</span>
                <Badge variant="secondary">{stats.immediateSales.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(stats.immediateSales.value)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <span>Layaway</span>
                <Badge variant="secondary">{stats.layaway.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(stats.layaway.value)}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.layaway.activeCount} active, {stats.layaway.completedCount} completed
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                <span>Future Collection</span>
                <Badge variant="secondary">{stats.futureCollection.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(stats.futureCollection.value)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <Badge variant="outline">{stats.statusBreakdown.pending}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confirmed</span>
                  <Badge variant="outline">{stats.statusBreakdown.confirmed}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Partially Paid</span>
                  <Badge variant="outline">{stats.statusBreakdown.partiallyPaid}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fully Paid</span>
                  <Badge variant="outline">{stats.statusBreakdown.fullyPaid}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ready</span>
                  <Badge variant="outline">{stats.statusBreakdown.readyForCollection}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <Badge variant="secondary">{stats.statusBreakdown.completed}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cancelled</span>
                  <Badge variant="destructive">{stats.statusBreakdown.cancelled}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reversed</span>
                  <Badge variant="destructive">{stats.statusBreakdown.reversed}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key performance indicators for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {((stats.statusBreakdown.completed / Math.max(stats.totalOrders, 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.quotations.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Quote Conversion</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.averageOrderValue)}
              </div>
              <div className="text-sm text-muted-foreground">Average Order Value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}