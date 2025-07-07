// app/(main)/stock-movements/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { StockMovementDTO } from "@/lib/http-service/stock-movements/types"

interface StockMovementsTableProps {
  stockMovements: StockMovementDTO[]
  totalPages: number
  currentPage: number
  totalElements: number
}

export function StockMovementsTable({ 
  stockMovements = [], 
  totalPages, 
  currentPage, 
  totalElements 
}: StockMovementsTableProps) {
  
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

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Movement Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Stock Before</TableHead>
              <TableHead>Stock After</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!stockMovements || stockMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No stock movements found.
                </TableCell>
              </TableRow>
            ) : (
              stockMovements.map((movement) => (
                <TableRow key={movement.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      {movement.productName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      {movement.orderNumber || '-'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      <Badge className={getMovementTypeColor(movement.movementType)}>
                        {formatMovementType(movement.movementType)}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      <span className={movement.quantity > 0 ? "text-green-600" : "text-red-600"}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      {movement.stockBefore}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      {movement.stockAfter}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      {movement.createdByName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      {new Date(movement.movementDate).toLocaleDateString()} {new Date(movement.movementDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                      {movement.reversed ? (
                        <Badge variant="destructive">Reversed</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {stockMovements.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalElements)} of {totalElements} movements
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild={currentPage > 1}
              disabled={currentPage <= 1}
            >
              {currentPage > 1 ? (
                <Link href={`/stock-movements?page=${currentPage - 1}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </>
              )}
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={`/stock-movements?page=${page}`}>
                      {page}
                    </Link>
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              asChild={currentPage < totalPages}
              disabled={currentPage >= totalPages}
            >
              {currentPage < totalPages ? (
                <Link href={`/stock-movements?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}