// app/(main)/orders/components/ready-for-collection-table.tsx
import { getOrdersReadyForCollectionAction } from "@/actions/orders"
import { OrdersTable } from "../components/table"
import { ReadyForCollectionFilters } from "./ready-for-collection-filters"
import { ExportButton } from "./export-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ReadyForCollectionTableProps {
  searchParams?: {
    customerName?: string
    orderNumber?: string
    startDate?: string
    endDate?: string
    page?: string
    size?: string
    sortBy?: string
    sortDir?: string
  }
}

export async function ReadyForCollectionTable({ searchParams }: ReadyForCollectionTableProps) {
  let readyOrders: any[] = []
  let stats = {
    total: 0,
    todaysOrders: 0,
    overdueOrders: 0,
    totalValue: 0,
    averageWaitTime: 0
  }
  
  try {
    const ordersResponse = await getOrdersReadyForCollectionAction()
    if (ordersResponse.success && ordersResponse.data) {
      readyOrders = ordersResponse.data
      
      // Calculate stats
      const today = new Date().toDateString()
      stats.total = readyOrders.length
      stats.todaysOrders = readyOrders.filter(order => 
        new Date(order.createdDate).toDateString() === today
      ).length
      stats.totalValue = readyOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      
      // Calculate overdue (orders ready for more than 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      stats.overdueOrders = readyOrders.filter(order => 
        new Date(order.createdDate) < sevenDaysAgo
      ).length
    }
  } catch (error) {
    console.error('Error fetching ready for collection orders:', error)
  }

  // Apply client-side filtering based on search params
  let filteredOrders = readyOrders

  if (searchParams?.customerName) {
    filteredOrders = filteredOrders.filter(order =>
      order.customerName.toLowerCase().includes(searchParams.customerName!.toLowerCase())
    )
  }

  if (searchParams?.orderNumber) {
    filteredOrders = filteredOrders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchParams.orderNumber!.toLowerCase())
    )
  }

  if (searchParams?.startDate) {
    filteredOrders = filteredOrders.filter(order =>
      new Date(order.createdDate) >= new Date(searchParams.startDate!)
    )
  }

  if (searchParams?.endDate) {
    filteredOrders = filteredOrders.filter(order =>
      new Date(order.createdDate) <= new Date(searchParams.endDate!)
    )
  }

  // Simple pagination
  const pageSize = parseInt(searchParams?.size || '10')
  const currentPage = parseInt(searchParams?.page || '1')
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredOrders.length / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ready for Collection</h2>
        <ExportButton orders={filteredOrders} filename="ready_for_collection_export" />
      </div>

      {/* Collection Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Collection</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <CardDescription>Orders waiting for pickup</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaysOrders}</div>
            <CardDescription>Ready today</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Collections</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueOrders}</div>
            <CardDescription>Waiting 7+ days</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <CardDescription>Ready for collection</CardDescription>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <ReadyForCollectionFilters currentParams={searchParams || {}} />
      
      {/* Priority Alert for Overdue */}
      {stats.overdueOrders > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  {stats.overdueOrders} orders have been waiting for collection for more than 7 days
                </p>
                <p className="text-sm text-red-600">
                  Consider contacting these customers to arrange pickup
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Ready for Collection Table */}
      <div className="border rounded-lg p-2">
        <OrdersTable 
          orders={paginatedOrders} 
          totalPages={totalPages}
          currentPage={currentPage}
          totalElements={filteredOrders.length}
          baseUrl="/orders?tab=ready"
          showCollectionActions={true}
          highlightOverdue={true}
        />
      </div>
    </div>
  )
}