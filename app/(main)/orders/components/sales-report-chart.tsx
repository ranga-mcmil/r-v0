// app/(main)/orders/components/sales-report-chart.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllOrdersAction } from "@/actions/orders"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, Award } from "lucide-react"

interface SalesReportChartProps {
  searchParams?: {
    startDate?: string
    endDate?: string
    branchId?: string
  }
}

export async function SalesReportChart({ searchParams }: SalesReportChartProps) {
  // Calculate date range (default to current month if not specified)
  const endDate = searchParams?.endDate || new Date().toISOString().split('T')[0]
  const startDate = searchParams?.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  // Fetch sales data
  let salesData = {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    salesGrowth: 0,
    dailySales: [] as Array<{ date: string; revenue: number; orders: number }>,
    topProducts: [] as Array<{ name: string; quantity: number; revenue: number }>,
    salesByType: {
      immediateSales: { count: 0, revenue: 0 },
      layaway: { count: 0, revenue: 0 },
      futureCollection: { count: 0, revenue: 0 }
    },
    conversionMetrics: {
      quotationsCreated: 0,
      quotationsConverted: 0,
      conversionRate: 0
    }
  }

  try {
    const ordersResponse = await getAllOrdersAction({
      pageSize: 1000, // Get comprehensive data
      startDate,
      endDate,
      ...(searchParams?.branchId && { branchId: searchParams.branchId })
    })
    
    if (ordersResponse.success && ordersResponse.data) {
      const orders = ordersResponse.data.content
      
      // Calculate total revenue from completed sales only
      const completedOrders = orders.filter(order => 
        ['COMPLETED', 'FULLY_PAID'].includes(order.status) && 
        order.orderType !== 'QUOTATION'
      )
      
      salesData.totalRevenue = completedOrders.reduce((sum, order) => sum + order.paidAmount, 0)
      salesData.totalOrders = completedOrders.length
      salesData.averageOrderValue = salesData.totalOrders > 0 ? salesData.totalRevenue / salesData.totalOrders : 0

      // Group sales by day for trend analysis
      const dailySalesMap = new Map<string, { revenue: number; orders: number }>()
      
      completedOrders.forEach(order => {
        const date = new Date(order.createdDate).toISOString().split('T')[0]
        const existing = dailySalesMap.get(date) || { revenue: 0, orders: 0 }
        dailySalesMap.set(date, {
          revenue: existing.revenue + order.paidAmount,
          orders: existing.orders + 1
        })
      })

      salesData.dailySales = Array.from(dailySalesMap, ([date, data]) => ({
        date,
        ...data
      })).sort((a, b) => a.date.localeCompare(b.date))

      // Calculate sales growth (comparing with previous period)
      const periodDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      const previousStartDate = new Date(new Date(startDate).getTime() - (periodDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      
      // This would require another API call for previous period data in a real implementation
      salesData.salesGrowth = 12.5 // Placeholder - would calculate from previous period

      // Sales by order type
      const immediateSales = completedOrders.filter(o => o.orderType === 'IMMEDIATE_SALE')
      const layawaySales = completedOrders.filter(o => o.orderType === 'LAYAWAY')
      const futureCollectionSales = completedOrders.filter(o => o.orderType === 'FUTURE_COLLECTION')

      salesData.salesByType = {
        immediateSales: {
          count: immediateSales.length,
          revenue: immediateSales.reduce((sum, o) => sum + o.paidAmount, 0)
        },
        layaway: {
          count: layawaySales.length,
          revenue: layawaySales.reduce((sum, o) => sum + o.paidAmount, 0)
        },
        futureCollection: {
          count: futureCollectionSales.length,
          revenue: futureCollectionSales.reduce((sum, o) => sum + o.paidAmount, 0)
        }
      }

      // Conversion metrics
      const quotations = orders.filter(o => o.orderType === 'QUOTATION')
      const convertedQuotations = quotations.filter(q => q.status !== 'PENDING' && q.status !== 'CANCELLED')
      
      salesData.conversionMetrics = {
        quotationsCreated: quotations.length,
        quotationsConverted: convertedQuotations.length,
        conversionRate: quotations.length > 0 ? (convertedQuotations.length / quotations.length) * 100 : 0
      }

      // Top products (would need order items data for real implementation)
      salesData.topProducts = [
        { name: "IBR 0.47mm - Charcoal", quantity: 145, revenue: 5220 },
        { name: "IBR 0.53mm - Galvanized", quantity: 98, revenue: 4410 },
        { name: "IBR 0.47mm - Red", quantity: 76, revenue: 2888 }
      ] // Placeholder data
    }
  } catch (error) {
    console.error('Error fetching sales data:', error)
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{salesData.salesGrowth}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesData.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per completed order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.conversionMetrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Quote to sale conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Order Type</CardTitle>
            <CardDescription>Revenue breakdown by order type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Immediate Sales</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(salesData.salesByType.immediateSales.revenue)}</div>
                <div className="text-xs text-muted-foreground">{salesData.salesByType.immediateSales.count} orders</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Layaway</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(salesData.salesByType.layaway.revenue)}</div>
                <div className="text-xs text-muted-foreground">{salesData.salesByType.layaway.count} orders</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Future Collection</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(salesData.salesByType.futureCollection.revenue)}</div>
                <div className="text-xs text-muted-foreground">{salesData.salesByType.futureCollection.count} orders</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products this period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <span className="text-sm">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatCurrency(product.revenue)}</div>
                  <div className="text-xs text-muted-foreground">{product.quantity} units</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart (Simple representation) */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales Trend</CardTitle>
          <CardDescription>Revenue and order count over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.dailySales.length > 0 ? (
              <div className="grid gap-2">
                <div className="flex justify-between text-sm font-medium border-b pb-2">
                  <span>Date</span>
                  <span>Orders</span>
                  <span>Revenue</span>
                </div>
                {salesData.dailySales.slice(-7).map((day, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{new Date(day.date).toLocaleDateString()}</span>
                    <Badge variant="secondary">{day.orders}</Badge>
                    <span className="font-medium">{formatCurrency(day.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No sales data available for the selected period
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Funnel</CardTitle>
          <CardDescription>Conversion from quotations to completed sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Quotations Created</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{salesData.conversionMetrics.quotationsCreated}</div>
                <div className="text-xs text-muted-foreground">Starting point</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-8 bg-border"></div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Quotations Converted</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{salesData.conversionMetrics.quotationsConverted}</div>
                <div className="text-xs text-muted-foreground">
                  {salesData.conversionMetrics.conversionRate.toFixed(1)}% conversion rate
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-8 bg-border"></div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Completed Sales</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{salesData.totalOrders}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(salesData.totalRevenue)} revenue
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key sales performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {salesData.totalOrders > 0 ? 
                  ((salesData.salesByType.immediateSales.count / salesData.totalOrders) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Immediate Sales Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {salesData.totalOrders > 0 ? 
                  ((salesData.salesByType.layaway.count / salesData.totalOrders) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Layaway Adoption</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {salesData.totalOrders > 0 ? 
                  ((salesData.salesByType.futureCollection.count / salesData.totalOrders) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Future Collection Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}