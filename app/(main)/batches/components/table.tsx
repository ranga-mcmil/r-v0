// app/(main)/batches/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { BatchDTO } from "@/lib/http-service/batches/types"

interface BatchesTableProps {
  batches: BatchDTO[]
}

export function BatchesTable({ batches = [] }: BatchesTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Number</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!batches || batches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No batches found.
              </TableCell>
            </TableRow>
          ) : (
            batches.map((batch) => (
              <TableRow key={batch.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/batches/${batch.id}`} className="block hover:underline">
                    {batch.batchNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/batches/${batch.id}`} className="block hover:underline">
                    {batch.description || '-'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/batches/${batch.id}`} className="block hover:underline">
                    {batch.createdByName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/batches/${batch.id}`} className="block hover:underline">
                    {new Date(batch.createdDate).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/batches/${batch.id}`} className="block hover:underline">
                    {batch.id}
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
