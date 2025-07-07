// app/(main)/stock-movements/product/[productId]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Package, TrendingUp, TrendingDown, Activity } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductStockHistoryAction, getProductStockSummaryAction } from "@/actions/stock-movements"
import { getProductAction } from "@/actions/products"
import { StockMovementsTable } from "../../components/table"
import { ExportButton } from "../../components/export-button"

interface ProductStockMovementsPageProps {
  params: {
    productId: string
  }
  searchParams?: {
    page?: string
    fromDate?: string
    toDate?: string
  }
}

export default async function ProductStockMovementsPage({ 
  params, 
  searchParams 
}: ProductStockMovementsPageProps) {
  const productId = parseInt(params.productId)

  if (isNaN(productId)) {
    notFound()
  }

  const queryParams = {
    pageNo: searchParams?.page ? parseInt(searchParams.page) - 1 : 0,
    pageSize: 10,
    sortBy: 'movementDate',
    sortDir: 'desc' as const,
  }

  // Fetch data server-side using existing actions
  const [productResponse, historyResponse, summaryResponse] = await Promise.all([
    getProductAction(productId),
    getProductStockHistoryAction(productId, queryParams),
    getProductStockSummaryAction(productId, {
      fromDate: searchParams?.fromDate,
      toDate: searchParams?.toDate,
    })
  ])
  
  if (!productResponse.success || !productResponse.data) {
    notFound()
  }

  const product = productResponse.data
  const stockMovements = (historyResponse.success && historyResponse.data) ? historyResponse.data.content : []
  const totalPages = (historyResponse.success && historyResponse.data) ? historyResponse.data.totalPages : 0
  const totalElements = (historyResponse.success && historyResponse.data) ? historyResponse.data.totalElements : 0
  const summary = (summaryResponse.success && summaryResponse.data) ? summaryResponse.data : null

  const currentPage = (queryParams.pageNo || 0) + 1

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/stock-movements">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Product Stock History</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{product.name || `Product ${product.code}`} - {product.colorName}</span>
              </div>
            </div>
          </div>
          <ExportButton stockMovements={stockMovements} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="font-medium">{product.name || `Product ${product.code}`}</div>
                <div className="text-sm text-muted-foreground">Current Stock: {product.stockQuantity}</div>
                <div className="text-sm text-muted-foreground">Price: ${product.price}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Total Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{summary?.totalMovements || totalElements}</div>
                <div className="text-sm text-muted-foreground">All time movements</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Increase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  +{summary?.totalIncrease || 0}
                </div>
                <div className="text-sm text-muted-foreground">Stock additions</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Total Decrease
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {summary?.totalDecrease || 0}
                </div>
                <div className="text-sm text-muted-foreground">Stock reductions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Movement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-lg font-semibold">
                    {summary.netChange > 0 ? '+' : ''}{summary.netChange}
                  </div>
                  <div className="text-sm text-muted-foreground">Net Change</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{summary.reversedMovements}</div>
                  <div className="text-sm text-muted-foreground">Reversed Movements</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {summary.lastMovementDate 
                      ? new Date(summary.lastMovementDate).toLocaleDateString()
                      : 'No movements'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Last Movement</div>
                </div>
              </div>
              
              {summary.movementTypeCounts && Object.keys(summary.movementTypeCounts).length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Movement Types:</div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(summary.movementTypeCounts).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span>{type.replace(/_/g, ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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