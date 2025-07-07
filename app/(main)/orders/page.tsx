// app/(main)/orders/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OrdersTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { SearchForm } from "./components/search-form"
import { getAllOrdersAction } from "@/actions/orders"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

interface OrdersPageProps {
  searchParams?: {
    orderType?: string
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

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // Get session for role-based access
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Build query parameters
  const queryParams = {
    pageNo: searchParams?.page ? parseInt(searchParams.page) - 1 : 0,
    pageSize: searchParams?.size ? parseInt(searchParams.size) : 10,
    sortBy: searchParams?.sortBy || 'createdDate',
    sortDir: (searchParams?.sortDir as 'asc' | 'desc') || 'desc',
    orderType: searchParams?.orderType as any,
    status: searchParams?.status as any,
    customerName: searchParams?.customerName,
    orderNumber: searchParams?.orderNumber,
    startDate: searchParams?.startDate,
    endDate: searchParams?.endDate,
  }

  // For non-admin users, filter by their branch
  if (session.user.role !== 'ROLE_ADMIN' && session.user.branchId) {
    // Note: You may need to add branchId to the query params if the API supports it
  }

  // Fetch data server-side using existing actions
  let orders: any[] = []
  let totalElements = 0
  let totalPages = 0
  
  try {
    const ordersResponse = await getAllOrdersAction(queryParams)
    if (ordersResponse.success && ordersResponse.data) {
      orders = ordersResponse.data.content
      totalElements = ordersResponse.data.totalElements
      totalPages = ordersResponse.data.totalPages
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    orders = []
  }

  // Calculate stats
  const quotations = orders.filter(order => order.orderType === 'QUOTATION').length
  const layawayOrders = orders.filter(order => order.orderType === 'LAYAWAY').length
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length
  const pendingOrders = orders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PARTIALLY_PAID'].includes(order.status)
  ).length

  const stats = {
    totalOrders: totalElements,
    quotations,
    layawayOrders,
    completedOrders,
    pendingOrders,
  }

  const currentPage = (queryParams.pageNo || 0) + 1

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage all customer orders and quotations</p>
          </div>
          <div className="flex gap-2">
            <ExportButton orders={orders} />
            
            {/* Create Order Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Order Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/orders/create/quotation">
                    <div className="flex flex-col">
                      <span>Quotation</span>
                      <span className="text-xs text-muted-foreground">Price estimate for customer</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/orders/create/immediate-sale">
                    <div className="flex flex-col">
                      <span>Immediate Sale</span>
                      <span className="text-xs text-muted-foreground">Full payment & collection</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/orders/create/future-collection">
                    <div className="flex flex-col">
                      <span>Future Collection</span>
                      <span className="text-xs text-muted-foreground">Paid, collect later</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/orders/create/layaway">
                    <div className="flex flex-col">
                      <span>Layaway</span>
                      <span className="text-xs text-muted-foreground">Payment plan order</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Stats 
          totalOrders={stats.totalOrders}
          quotations={stats.quotations}
          layawayOrders={stats.layawayOrders}
          completedOrders={stats.completedOrders}
          pendingOrders={stats.pendingOrders}
        />

        <SearchForm 
          currentParams={searchParams || {}}
          canViewAllBranches={session.user.role === 'ROLE_ADMIN'}
        />

        <div className="border rounded-lg p-2">
          <OrdersTable 
            orders={orders} 
            totalPages={totalPages}
            currentPage={currentPage}
            totalElements={totalElements}
          />
        </div>
      </main>
    </div>
  )
}