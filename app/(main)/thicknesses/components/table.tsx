// app/(main)/thicknesses/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { ThicknessDTO } from "@/lib/http-service/thicknesses/types"

interface ThicknessTableProps {
  thicknesses: ThicknessDTO[]
}

export function ThicknessTable({ thicknesses = [] }: ThicknessTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thickness (mm)</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!thicknesses || thicknesses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No thicknesses found.
              </TableCell>
            </TableRow>
          ) : (
            thicknesses.map((thickness) => (
              <TableRow key={thickness.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/thicknesses/${thickness.id}`} className="block hover:underline">
                    {thickness.thickness}mm
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/thicknesses/${thickness.id}`} className="block hover:underline">
                    {thickness.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/thicknesses/${thickness.id}`} className="block hover:underline">
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