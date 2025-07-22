// app/(main)/orders/components/layaway-table.tsx
import { getAllOrdersAction, getActiveLayawayOrdersAction, getOverdueLayawayOrdersAction } from "@/actions/orders"
import { OrdersTable } from "../components/table"
import { LayawayFilters } from "./layaway-filters"
import { ExportButton } from "./export-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface LayawayTableProps {
  searchParams?: {
    subTab?: string
    status?: string
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

export async function LayawayTable({ searchParams }: LayawayTableProps) {
  const subTab = searchParams?.subTab || 'all'
  
  // Build query parameters for layaway orders
  const queryParams = {
    pageNo: searchParams?.page ? parseInt(searchParams.page) - 1 : 0,
    pageSize: searchParams?.size ? parseInt(searchParams.size) : 10,
    sortBy: searchParams?.sortBy || 'createdDate',
    sortDir: (searchParams?.sortDir as 'asc' | 'desc') || 'desc',
    orderType: 'LAYAWAY' as any, // Force layaway only
    status: searchParams?.status as any,
    customerName: searchParams?.customerName,
    orderNumber: searchParams?.orderNumber,
    startDate: searchParams?.startDate,
    endDate: searchParams?.endDate,
  }

  let layawayOrders: any[] = []
  let activeOrders: any[] = []
  let overdueOrders: any[] = []
  let totalElements = 0
  let totalPages = 0
  let stats = {
    total: 0,
    active: 0,
    overdue: 0,
    completed: 0,
    totalValue: 0,
    totalPaid: 0
  }
  
  try {
    // Fetch different datasets based on sub-tab
    const [allLayawayResponse, activeResponse, overdueResponse] = await Promise.all([
      getAllOrdersAction(queryParams),
      getActiveLayawayOrdersAction(),
      getOverdueLayawayOrdersAction()
    ])
    
    if (allLayawayResponse.success && allLayawayResponse.data) {
      layawayOrders = allLayawayResponse.data.content
      totalElements = allLayawayResponse.data.totalElements
      totalPages = allLayawayResponse.data.totalPages
    }
    
    if (activeResponse.success && activeResponse.data) {
      activeOrders = activeResponse.data
    }
    
    if (overdueResponse.success && overdueResponse.data) {
      overdueOrders = overdueResponse.data
    }
    
    // Calculate stats
    stats.total = layawayOrders.length
    stats.active = activeOrders.length
    stats.overdue = overdueOrders.length
    stats.completed = layawayOrders.filter(o => o.status === 'COMPLETED').length
    stats.totalValue = layawayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    stats.totalPaid = layawayOrders.reduce((sum, o) => sum + o.paidAmount, 0)
    
  } catch (error) {
    console.error('Error fetching layaway orders:', error)
  }

  const currentPage = (queryParams.pageNo || 0) + 1

  // Determine which orders to show based on sub-tab
  let displayOrders = layawayOrders
  let displayTotalElements = totalElements
  let displayTotalPages = totalPages
  
  if (subTab === 'active') {
    displayOrders = activeOrders
    displayTotalElements = activeOrders.length
    displayTotalPages = Math.ceil(activeOrders.length / (queryParams.pageSize || 10))
  } else if (subTab === 'overdue') {
    displayOrders = overdueOrders
    displayTotalElements = overdueOrders.length
    displayTotalPages = Math.ceil(overdueOrders.length / (queryParams.pageSize || 10))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Layaway Orders</h2>
        <ExportButton orders={displayOrders} filename="layaway_orders_export" />
      </div>

      {/* Layaway Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Layaway</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <CardDescription>All layaway orders</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <CardDescription>Currently paying</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <CardDescription>Missed payments</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalValue > 0 ? Math.round((stats.totalPaid / stats.totalValue) * 100) : 0}%
            </div>
            <CardDescription>Payment progress</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Sub-tabs for layaway */}
      <Tabs value={subTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Layaway
            <Badge variant="secondary">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            Active
            <Badge variant="secondary">{stats.active}</Badge>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center gap-2">
            Overdue
            <Badge variant="destructive">{stats.overdue}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <LayawayFilters currentParams={searchParams || {}} subTab="all" />
          <div className="border rounded-lg p-2 mt-4">
            <OrdersTable 
              orders={layawayOrders} 
              totalPages={totalPages}
              currentPage={currentPage}
              totalElements={totalElements}
              baseUrl="/orders?tab=layaway&subTab=all"
              showPaymentActions={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="active">
          <LayawayFilters currentParams={searchParams || {}} subTab="active" />
          <div className="border rounded-lg p-2 mt-4">
            <OrdersTable 
              orders={activeOrders} 
              totalPages={displayTotalPages}
              currentPage={1}
              totalElements={displayTotalElements}
              baseUrl="/orders?tab=layaway&subTab=active"
              showPaymentActions={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="overdue">
          <LayawayFilters currentParams={searchParams || {}} subTab="overdue" />
          <div className="border rounded-lg p-2 mt-4">
            <OrdersTable 
              orders={overdueOrders} 
              totalPages={displayTotalPages}
              currentPage={1}
              totalElements={displayTotalElements}
              baseUrl="/orders?tab=layaway&subTab=overdue"
              showPaymentActions={true}
              highlightOverdue={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}