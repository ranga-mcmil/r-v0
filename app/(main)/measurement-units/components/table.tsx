// app/(main)/measurement-units/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { MeasurementUnitDTO } from "@/lib/http-service/measurement-units/types"

interface MeasurementUnitsTableProps {
  measurementUnits: MeasurementUnitDTO[]
}

export function MeasurementUnitsTable({ measurementUnits = [] }: MeasurementUnitsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit of Measure</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!measurementUnits || measurementUnits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No measurement units found.
              </TableCell>
            </TableRow>
          ) : (
            measurementUnits.map((unit) => (
              <TableRow key={unit.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/measurement-units/${unit.id}`} className="block hover:underline">
                    {unit.unitOfMeasure}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/measurement-units/${unit.id}`} className="block hover:underline">
                    {unit.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/measurement-units/${unit.id}`} className="block hover:underline">
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