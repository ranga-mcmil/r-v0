// app/(main)/branches/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { BranchDTO } from "@/lib/http-service/branches/types"

interface BranchesTableProps {
  branches: BranchDTO[]
}

export function BranchesTable({ branches = [] }: BranchesTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>City</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!branches || branches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No branches found.
              </TableCell>
            </TableRow>
          ) : (
            branches.map((branch) => (
              <TableRow key={branch.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/branches/${branch.id}`} className="block hover:underline">
                    {branch.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/branches/${branch.id}`} className="block hover:underline">
                    {branch.location}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/branches/${branch.id}`} className="block hover:underline">
                    {branch.address.street}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/branches/${branch.id}`} className="block hover:underline">
                    <Badge variant={branch.isActive ? "default" : "secondary"}>
                      {branch.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/branches/${branch.id}`} className="block hover:underline">
                    {branch.address.city}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/branches/${branch.id}`} className="block hover:underline">
                    {branch.id.slice(0, 8)}...
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
