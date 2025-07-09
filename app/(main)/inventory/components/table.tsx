// app/(main)/inventory/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { InventoryDTO } from "@/lib/http-service/inventory/types"

interface InventoryTableProps {
  inventory: InventoryDTO[]
}

export function InventoryTable({ inventory = [] }: InventoryTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Total Stock</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!inventory || inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No inventory movements found.
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => (
              <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`#`} className="block hover:underline">
                    {item.productName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} className="block hover:underline">
                    {item.batchNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} className="block hover:underline">
                    {item.quantity}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} className="block hover:underline">
                    {item.length && item.width 
                      ? `${item.length} × ${item.width}` 
                      : '-'
                    }
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} className="block hover:underline">
                    {item.weight || '-'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} className="block hover:underline">
                    <span className={item.totalStockQuantity <= 10 ? "text-red-600 font-medium" : ""}>
                      {item.totalStockQuantity}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} className="block hover:underline">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} className="block hover:underline">
                    {item.remarks || '-'}
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