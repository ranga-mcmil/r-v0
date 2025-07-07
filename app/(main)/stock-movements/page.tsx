// app/(main)/stock-movements/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { StockMovementsTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getAllStockMovementsAction } from "@/actions/stock-movements"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"
import { SearchForm } from "./components/search-form"

interface StockMovementsPageProps {
  searchParams?: {
    productId?: string
    orderId?: string
    movementType?: string
    branchId?: string
    fromDate?: string
    toDate?: string
    page?: string
    size?: string
  }
}

export default async function StockMovementsPage({ searchParams }: StockMovementsPageProps) {
  // Get session for role-based access
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Build query parameters
  const queryParams = {
    pageNo: searchParams?.page ? parseInt(searchParams.page) - 1 : 0,
    pageSize: searchParams?.size ? parseInt(searchParams.size) : 10,
    sortBy: 'movementDate',
    sortDir: 'desc' as const,
    productId: searchParams?.productId ? parseInt(searchParams.productId) : undefined,
    orderId: searchParams?.orderId ? parseInt(searchParams.orderId) : undefined,
    movementType: searchParams?.movementType || undefined,
    branchId: searchParams?.branchId || undefined,
    fromDate: searchParams?.fromDate || undefined,
    toDate: searchParams?.toDate || undefined,
  }

  // For non-admin users, filter by their branch
  if (session.user.role !== 'ROLE_ADMIN' && session.user.branchId) {
    queryParams.branchId = session.user.branchId
  }

  // Fetch data server-side using existing actions
  let stockMovements: any[] = []
  let totalElements = 0
  let totalPages = 0
  
  try {
    const stockMovementsResponse = await getAllStockMovementsAction(queryParams)
    if (stockMovementsResponse.success && stockMovementsResponse.data) {
      stockMovements = stockMovementsResponse.data.content
      totalElements = stockMovementsResponse.data.totalElements
      totalPages = stockMovementsResponse.data.totalPages
    }
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    stockMovements = []
  }

  // Calculate stats
  const inboundMovements = stockMovements.filter(item => 
    ['STOCK_ADDITION', 'STOCK_INCREASE', 'ADJUSTMENT_INCREASE'].includes(item.movementType)
  ).length
  const outboundMovements = stockMovements.filter(item => 
    ['SALE', 'STOCK_DECREASE', 'ADJUSTMENT_DECREASE'].includes(item.movementType)
  ).length
  const reversedMovements = stockMovements.filter(item => item.reversed).length

  const stats = {
    totalMovements: totalElements,
    inboundMovements,
    outboundMovements,
    reversedMovements,
  }

  const currentPage = (queryParams.pageNo || 0) + 1

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock Movements</h1>
            <p className="text-muted-foreground">Track all inventory stock movements and changes</p>
          </div>
          <div className="flex gap-2">
            <ExportButton stockMovements={stockMovements} />
            <Button variant="outline" asChild>
              <Link href="/inventory">
                <Filter className="mr-2 h-4 w-4" /> Manage Inventory
              </Link>
            </Button>
          </div>
        </div>

        <Stats 
          totalMovements={stats.totalMovements}
          inboundMovements={stats.inboundMovements}
          outboundMovements={stats.outboundMovements}
          reversedMovements={stats.reversedMovements}
        />

        <SearchForm 
          currentParams={searchParams || {}}
          canViewAllBranches={session.user.role === 'ROLE_ADMIN'}
        />

        <div className="border rounded-lg p-2">
          <StockMovementsTable 
            stockMovements={stockMovements} 
            totalPages={totalPages}
            currentPage={currentPage}
            totalElements={totalElements}
          />
        </div>
      </main>
    </div>
  )
}