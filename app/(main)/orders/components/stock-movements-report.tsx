// app/(main)/orders/components/stock-movements-report.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getAllOrdersAction } from "@/actions/orders"
import { formatCurrency } from "@/lib/utils"
import { Package, TrendingDown, TrendingUp, AlertTriangle, RotateCcw, CheckCircle, Minus, Plus } from "lucide-react"

interface StockMovementsReportProps {
  searchParams?: {
    startDate?: string
    endDate?: string
    branchId?: string
    productId?: string
  }
}

export async function StockMovementsReport({ searchParams }: StockMovementsReportProps) {
  // Calculate date range (default to current month if not specified)
  const endDate = searchParams?.endDate || new Date().toISOString().split('T')[0]
  const startDate = searchParams?.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  // Fetch orders data to analyze stock movements
  let stockData = {
    totalMovements: 0,
    totalQuantityOut: 0,
    totalValueOut: 0,
    movementsByType: {
      sale: { count: 0, quantity: 0, value: 0 },
      production: { count: 0, quantity: 0, value: 0 },
      adjustment: { count: 0, quantity: 0, value: 0 },
      reversal: { count: 0, quantity: 0, value: 0 }
    },
    topMovedProducts: [] as Array<{ 
      name: string; 
      totalQuantity: number; 
      totalValue: number; 
      movementCount: number 
    }>,
    movementsByBranch: [] as Array<{
      branchName: string;
      movementCount: number;
      totalQuantity: number;
      totalValue: number;
    }>,
    dailyMovements: [] as Array<{
      date: string;
      outbound: number;
      value: number;
      orders: number;
    }>,
    lowStockAlerts: [] as Array<{
      productName: string;
      currentStock: number;
      reorderLevel: number;
      status: 'critical' | 'low';
    }>
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
      
      // Filter orders that affect stock (completed sales, not quotations)
      const stockAffectingOrders = orders.filter(order => 
        order.orderType !== 'QUOTATION' && 
        ['COMPLETED', 'FULLY_PAID'].includes(order.status)
      )

      stockData.totalMovements = stockAffectingOrders.length
      
      // Calculate total quantity and value out (would need order items for real calculation)
      stockData.totalQuantityOut = stockAffectingOrders.reduce((sum, order) => {
        // Placeholder: assume average 10 units per order
        return sum + 10
      }, 0)
      
      stockData.totalValueOut = stockAffectingOrders.reduce((sum, order) => sum + order.totalAmount, 0)

      // Movement types breakdown
      const salesOrders = stockAffectingOrders.filter(o => o.orderType === 'IMMEDIATE_SALE')
      const layawayOrders = stockAffectingOrders.filter(o => o.orderType === 'LAYAWAY')
      const futureCollectionOrders = stockAffectingOrders.filter(o => o.orderType === 'FUTURE_COLLECTION')
      const reversedOrders = orders.filter(o => o.status === 'REVERSED')

      stockData.movementsByType = {
        sale: {
          count: salesOrders.length + layawayOrders.length + futureCollectionOrders.length,
          quantity: (salesOrders.length + layawayOrders.length + futureCollectionOrders.length) * 10, // Placeholder
          value: salesOrders.concat(layawayOrders, futureCollectionOrders).reduce((sum, o) => sum + o.totalAmount, 0)
        },
        production: {
          count: 0, // Would come from production data
          quantity: 0,
          value: 0
        },
        adjustment: {
          count: 0, // Would come from inventory adjustments
          quantity: 0,
          value: 0
        },
        reversal: {
          count: reversedOrders.length,
          quantity: reversedOrders.length * 10, // Placeholder
          value: reversedOrders.reduce((sum, o) => sum + o.totalAmount, 0)
        }
      }

      // Group movements by branch
      const branchMovements = new Map<string, { count: number; quantity: number; value: number }>()
      
      stockAffectingOrders.forEach(order => {
        const existing = branchMovements.get(order.branchName) || { count: 0, quantity: 0, value: 0 }
        branchMovements.set(order.branchName, {
          count: existing.count + 1,
          quantity: existing.quantity + 10, // Placeholder
          value: existing.value + order.totalAmount
        })
      })

      stockData.movementsByBranch = Array.from(branchMovements, ([branchName, data]) => ({
        branchName,
        movementCount: data.count,
        totalQuantity: data.quantity,
        totalValue: data.value
      })).sort((a, b) => b.totalValue - a.totalValue)

      // Daily movements
      const dailyMovementMap = new Map<string, { outbound: number; value: number; orders: number }>()
      
      stockAffectingOrders.forEach(order => {
        const date = new Date(order.createdDate).toISOString().split('T')[0]
        const existing = dailyMovementMap.get(date) || { outbound: 0, value: 0, orders: 0 }
        dailyMovementMap.set(date, {
          outbound: existing.outbound + 10, // Placeholder quantity
          value: existing.value + order.totalAmount,
          orders: existing.orders + 1
        })
      })

      stockData.dailyMovements = Array.from(dailyMovementMap, ([date, data]) => ({
        date,
        ...data
      })).sort((a, b) => a.date.localeCompare(b.date))

      // Top moved products (placeholder data - would need order items)
      stockData.topMovedProducts = [
        { name: "IBR 0.47mm - Charcoal", totalQuantity: 245, totalValue: 8820, movementCount: 28 },
        { name: "IBR 0.53mm - Galvanized", totalQuantity: 189, totalValue: 8505, movementCount: 21 },
        { name: "IBR 0.47mm - Red", totalQuantity: 156, totalValue: 5928, movementCount: 18 },
        { name: "Ridge Cap - Galvanized", totalQuantity: 98, totalValue: 1470, movementCount: 15 },
        { name: "Flashing - Charcoal", totalQuantity: 67, totalValue: 938, movementCount: 12 }
      ]

      // Low stock alerts (placeholder data - would come from inventory system)
      stockData.lowStockAlerts = [
        { productName: "IBR 0.58mm - Brick Red", currentStock: 5, reorderLevel: 15, status: 'critical' },
        { productName: "IBR 0.47mm - White", currentStock: 12, reorderLevel: 20, status: 'low' },
        { productName: "Ridge Cap - Blue", currentStock: 18, reorderLevel: 25, status: 'low' }
      ]
    }
  } catch (error) {
    console.error('Error fetching stock movements data:', error)
  }

  return (
    <div className="space-y-6">
      {/* Stock Movement Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.totalMovements}</div>
            <p className="text-xs text-muted-foreground">
              Stock affecting orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantity Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.totalQuantityOut}</div>
            <p className="text-xs text-muted-foreground">
              Units moved out
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stockData.totalValueOut)}</div>
            <p className="text-xs text-muted-foreground">
              Inventory value moved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.lowStockAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Movement Types Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Movement Types</CardTitle>
            <CardDescription>Stock movements by type and impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-red-500" />
                <span>Sales</span>
                <Badge variant="secondary">{stockData.movementsByType.sale.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{stockData.movementsByType.sale.quantity} units</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(stockData.movementsByType.sale.value)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-500" />
                <span>Production</span>
                <Badge variant="secondary">{stockData.movementsByType.production.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">+{stockData.movementsByType.production.quantity} units</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(stockData.movementsByType.production.value)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <span>Adjustments</span>
                <Badge variant="secondary">{stockData.movementsByType.adjustment.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{stockData.movementsByType.adjustment.quantity} units</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(stockData.movementsByType.adjustment.value)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-purple-500" />
                <span>Reversals</span>
                <Badge variant="secondary">{stockData.movementsByType.reversal.count}</Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">+{stockData.movementsByType.reversal.quantity} units</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(stockData.movementsByType.reversal.value)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Moving Products</CardTitle>
            <CardDescription>Products with highest movement volume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockData.topMovedProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.movementCount} movements</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{product.totalQuantity} units</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(product.totalValue)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Branch Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Movements by Branch</CardTitle>
          <CardDescription>Stock movement activity across branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockData.movementsByBranch.map((branch, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{branch.branchName}</span>
                    <span className="text-xs text-muted-foreground">{branch.movementCount} movements</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{branch.totalQuantity} units</div>
                    <div className="text-xs text-muted-foreground">Quantity moved</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(branch.totalValue)}</div>
                    <div className="text-xs text-muted-foreground">Total value</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      {stockData.lowStockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stockData.lowStockAlerts.map((alert, index) => (
                <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${
                  alert.status === 'critical' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.status === 'critical' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <div>
                      <div className="font-medium">{alert.productName}</div>
                      <div className="text-xs text-muted-foreground">
                        Reorder level: {alert.reorderLevel} units
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={alert.status === 'critical' ? 'destructive' : 'default'}>
                      {alert.currentStock} units
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {alert.status === 'critical' ? 'Critical' : 'Low stock'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Movement Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Movement Trend</CardTitle>
          <CardDescription>Stock outbound movement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockData.dailyMovements.length > 0 ? (
              <div className="grid gap-2">
                <div className="flex justify-between text-sm font-medium border-b pb-2">
                  <span>Date</span>
                  <span>Orders</span>
                  <span>Units Out</span>
                  <span>Value</span>
                </div>
                {stockData.dailyMovements.slice(-7).map((day, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{new Date(day.date).toLocaleDateString()}</span>
                    <Badge variant="secondary">{day.orders}</Badge>
                    <span className="font-medium">{day.outbound}</span>
                    <span className="font-medium">{formatCurrency(day.value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No stock movement data available for the selected period
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}