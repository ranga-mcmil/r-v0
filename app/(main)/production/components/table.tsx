// app/(main)/production/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { ProductionDTO } from "@/lib/http-service/productions/types"

interface ProductionTableProps {
  productions: ProductionDTO[]
}

export function ProductionTable({ productions = [] }: ProductionTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Batch Number</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!productions || productions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No production records found.
              </TableCell>
            </TableRow>
          ) : (
            productions.map((production) => (
              <TableRow key={production.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/production/${production.id}`} className="block hover:underline">
                    {production.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/production/${production.id}`} className="block hover:underline">
                    {production.inventoryBatchNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/production/${production.id}`} className="block hover:underline">
                    {production.quantity}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/production/${production.id}`} className="block hover:underline">
                    {production.remarks || '-'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/production/${production.id}`} className="block hover:underline">
                    {new Date(production.createdAt).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/production/${production.id}`} className="block hover:underline">
                    {production.id}
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