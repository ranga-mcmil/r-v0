// app/(main)/inventory/history/[productId]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Package, History } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getInventoryHistoryAction } from "@/actions/inventory"
import { getProductAction } from "@/actions/products"
import { InventoryTable } from "../../components/table"
import { ExportButton } from "../../components/export-button"

interface InventoryHistoryPageProps {
  params: {
    productId: string
  }
}

export default async function InventoryHistoryPage({ params }: InventoryHistoryPageProps) {
  const productId = parseInt(params.productId)

  if (isNaN(productId)) {
    notFound()
  }

  // Fetch data server-side using existing actions
  const [productResponse, historyResponse] = await Promise.all([
    getProductAction(productId),
    getInventoryHistoryAction(productId)
  ])
  
  if (!productResponse.success || !productResponse.data) {
    notFound()
  }

  const product = productResponse.data
  const inventory = (historyResponse.success && historyResponse.data) ? historyResponse.data.content : []

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/inventory">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Inventory History</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{product.name || `Product ${product.code}`}</span>
              </div>
            </div>
          </div>
          <ExportButton inventory={inventory} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="font-medium">{product.name || `Product ${product.code}`}</div>
                <div className="text-sm text-muted-foreground">Product Name</div>
                <div className="font-medium">{product.code}</div>
                <div className="text-sm text-muted-foreground">Product Code</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4" />
                Movement Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total movements:</span>
                  <span className="text-sm font-medium">{inventory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Current stock:</span>
                  <span className="text-sm font-medium">{product.stockQuantity}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Latest Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {inventory.length > 0 ? (
                  <>
                    <div className="font-medium">{new Date(inventory[0].createdAt).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {inventory[0].quantity} units - {inventory[0].batchNumber}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">No movements found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg p-2">
          <InventoryTable inventory={inventory} />
        </div>
      </main>
    </div>
  )
}