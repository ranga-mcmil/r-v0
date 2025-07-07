// app/(main)/stock-movements/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, FileText, User, Calendar, Activity, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getStockMovementByIdAction } from "@/actions/stock-movements"

interface StockMovementDetailsPageProps {
  params: {
    id: string
  }
}

export default async function StockMovementDetailsPage({ params }: StockMovementDetailsPageProps) {
  const movementId = parseInt(params.id)

  if (isNaN(movementId)) {
    notFound()
  }

  // Fetch data server-side using existing action
  const movementResponse = await getStockMovementByIdAction(movementId)
  
  if (!movementResponse.success || !movementResponse.data) {
    notFound()
  }

  const movement = movementResponse.data

  const getMovementTypeColor = (movementType: string) => {
    switch (movementType) {
      case 'STOCK_ADDITION':
      case 'STOCK_INCREASE':
      case 'ADJUSTMENT_INCREASE':
        return 'bg-green-100 text-green-800'
      case 'SALE':
      case 'STOCK_DECREASE':
      case 'ADJUSTMENT_DECREASE':
        return 'bg-red-100 text-red-800'
      case 'PRODUCTION':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatMovementType = (movementType: string) => {
    return movementType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const stockChange = movement.stockAfter - movement.stockBefore

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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Stock Movement #{movement.id}</h1>
                {movement.reversed && (
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Reversed
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{movement.productName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Movement Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{movement.productName}</div>
                <div className="text-sm text-muted-foreground">Product</div>
              </div>
              <div>
                <Badge className={getMovementTypeColor(movement.movementType)}>
                  {formatMovementType(movement.movementType)}
                </Badge>
                <div className="text-sm text-muted-foreground">Movement Type</div>
              </div>
              <div>
                <div className={`font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                </div>
                <div className="text-sm text-muted-foreground">Quantity Change</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Stock Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{movement.stockBefore}</div>
                <div className="text-sm text-muted-foreground">Stock Before</div>
              </div>
              <div>
                <div className="font-medium">{movement.stockAfter}</div>
                <div className="text-sm text-muted-foreground">Stock After</div>
              </div>
              <div>
                <div className={`font-medium ${stockChange > 0 ? 'text-green-600' : stockChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {stockChange > 0 ? '+' : ''}{stockChange}
                </div>
                <div className="text-sm text-muted-foreground">Net Change</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Movement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{movement.createdByName}</div>
                  <div className="text-sm text-muted-foreground">Created by</div>
                </div>
              </div>
              <div>
                <div className="font-medium">
                  {new Date(movement.movementDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(movement.movementDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {movement.orderNumber && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Related Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{movement.orderNumber}</div>
                  <div className="text-sm text-muted-foreground">Order Number</div>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/orders?search=${movement.orderNumber}`}>
                    View Order
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {movement.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{movement.notes}</p>
            </CardContent>
          </Card>
        )}

        {movement.reversed && movement.reversedDate && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                Reversal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-800">
                <div className="font-medium">Movement Reversed</div>
                <div className="mt-1">
                  Reversed on: {new Date(movement.reversedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/stock-movements?productId=${movement.productId}`}>
              View Product Movements
            </Link>
          </Button>
          {movement.orderNumber && (
            <Button variant="outline" asChild>
              <Link href={`/stock-movements?orderNumber=${movement.orderNumber}`}>
                View Order Movements
              </Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}