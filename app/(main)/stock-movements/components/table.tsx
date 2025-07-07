// app/(main)/stock-movements/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { StockMovementDTO } from "@/lib/http-service/stock-movements/types"

interface StockMovementsTableProps {
  movements: StockMovementDTO[]
}

export function StockMovementsTable({ movements = [] }: StockMovementsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Stock Before</TableHead>
            <TableHead>Stock After</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!movements || movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No stock movements found.
              </TableCell>
            </TableRow>
          ) : (
            movements.map((movement) => (
              <TableRow key={movement.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                    {movement.productName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                    {movement.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                    <Badge variant={movement.movementType.includes('IN') ? 'default' : 'secondary'}>
                      {movement.movementType.replace('_', ' ')}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                    <span className={movement.quantity < 0 ? "text-red-600" : "text-green-600"}>
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
                    {new Date(movement.movementDate).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                    {movement.createdByName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/stock-movements/${movement.id}`} className="block hover:underline">
                    <Badge variant={movement.reversed ? "destructive" : "default"}>
                      {movement.reversed ? "Reversed" : "Active"}
                    </Badge>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
