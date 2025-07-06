// app/(main)/colors/components/colors-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { ColorDTO } from "@/lib/http-service/colors/types"

interface ColorsTableProps {
  colors: ColorDTO[]
}

export function ColorsTable({ colors }: ColorsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No colors found.
              </TableCell>
            </TableRow>
          ) : (
            colors.map((color) => (
              <TableRow key={color.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/colors/${color.id}`} className="block hover:underline">
                    {color.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/colors/${color.id}`} className="block hover:underline">
                    {color.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/colors/${color.id}`} className="block hover:underline">
                    0 {/* TODO: Get actual product count */}
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