// app/(main)/orders/[id]/components/order-items-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { OrderItemResponseDTO } from "@/lib/http-service/orders/types"

interface OrderItemsTableProps {
  items: OrderItemResponseDTO[]
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Dimensions</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No items in this order
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.productCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm">
                      {item.length > 0 && item.width > 0 ? (
                        <span className="text-muted-foreground">
                          {item.length}m × {item.width}m
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.totalPrice)}
                  </TableCell>
                  <TableCell>
                    {item.notes ? (
                      <div className="text-sm text-muted-foreground max-w-32 truncate" title={item.notes}>
                        {item.notes}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Items:</span>
              <span className="font-medium">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Quantity:</span>
              <span className="font-medium">{totalQuantity}</span>
            </div>
            <div className="flex justify-between text-base border-t pt-2">
              <span className="font-medium">Total Value:</span>
              <span className="font-bold">{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}