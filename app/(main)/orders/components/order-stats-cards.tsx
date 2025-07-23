// app/(main)/orders/components/order-stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, FileText, CreditCard, CheckCircle, Clock, Package } from "lucide-react"
import { getAllOrdersAction } from "@/actions/orders"
import { formatCurrency } from "@/lib/utils"

export async function OrderStatsCards() {
  // Fetch basic stats - you might want to create dedicated stats endpoints
  let stats = {
    totalOrders: 0,
    quotations: 0,
    layawayOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    readyForCollection: 0,
    totalValue: 0
  }

  try {
    // Get recent orders for stats calculation
    const ordersResponse = await getAllOrdersAction()
    
    if (ordersResponse.success && ordersResponse.data) {
      const orders = ordersResponse.data.content
      
      stats.totalOrders = ordersResponse.data.totalElements
      stats.quotations = orders.filter(order => order.orderType === 'QUOTATION').length
      stats.layawayOrders = orders.filter(order => order.orderType === 'LAYAWAY').length
      stats.completedOrders = orders.filter(order => order.status === 'COMPLETED').length
      stats.pendingOrders = orders.filter(order => 
        ['PENDING', 'CONFIRMED', 'PARTIALLY_PAID'].includes(order.status)
      ).length
      stats.readyForCollection = orders.filter(order => 
        order.status === 'READY_FOR_COLLECTION'
      ).length
      stats.totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    }
  } catch (error) {
    console.error('Error fetching order stats:', error)
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      description: "All orders & quotations",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      description: "Combined order value",
      icon: Package,
      color: "text-green-600"
    },
    {
      title: "Quotations",
      value: stats.quotations.toString(),
      description: "Pending quotations",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Layaway Orders",
      value: stats.layawayOrders.toString(),
      description: "Payment plan orders",
      icon: CreditCard,
      color: "text-orange-600"
    },
    {
      title: "Ready for Collection",
      value: stats.readyForCollection.toString(),
      description: "Ready to collect",
      icon: Package,
      color: "text-indigo-600"
    },
    {
      title: "Completed",
      value: stats.completedOrders.toString(),
      description: "Finished orders",
      icon: CheckCircle,
      color: "text-emerald-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}