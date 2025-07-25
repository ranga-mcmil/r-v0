// app/(main)/orders/page.tsx
import { Suspense } from "react"
import { OrderTabsNavigation } from "./components/order-tabs-navigation"
import { AllOrdersTable } from "./components/all-orders-table"
import { QuotationsTable } from "./components/quotations-table" 
import { LayawayTable } from "./components/layaway-table"
import { ReadyForCollectionTable } from "./components/ready-for-collection-table"
import { ReportsSection } from "./components/reports-section"
import { OrderStatsCards } from "./components/order-stats-cards"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

interface OrdersPageProps {
  searchParams?: {
    tab?: string
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

  const activeTab = searchParams?.tab || 'all'
  
  // Only users with branch assignment or admins can access orders
  if (session.user.role !== 'ROLE_ADMIN' && !session.user.branchId) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage all customer orders and quotations</p>
          </div>
          <div className="flex gap-2">
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

        {/* Stats Cards */}
        <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>}>
          <OrderStatsCards />
        </Suspense>

        {/* Tab Navigation */}
        <OrderTabsNavigation currentTab={activeTab} />

        {/* Tab Content */}
        <Suspense fallback={<TableSkeleton columnCount={9} rowCount={5} />}>
          {activeTab === 'all' && <AllOrdersTable searchParams={searchParams} />}
          {activeTab === 'quotations' && <QuotationsTable searchParams={searchParams} />}
          {activeTab === 'layaway' && <LayawayTable searchParams={searchParams} />}
          {activeTab === 'ready' && <ReadyForCollectionTable searchParams={searchParams} />}
          {activeTab === 'reports' && <ReportsSection searchParams={searchParams} />}
        </Suspense>
      </main>
    </div>
  )
}