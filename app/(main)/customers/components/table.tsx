// app/(main)/customers/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { CustomerDTO } from "@/lib/http-service/customers/types"

interface CustomersTableProps {
  customers: CustomerDTO[]
}

export function CustomersTable({ customers = [] }: CustomersTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!customers || customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/customers/${customer.id}`} className="block hover:underline">
                    {customer.firstName} {customer.lastName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/customers/${customer.id}`} className="block hover:underline">
                    {customer.email || '-'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/customers/${customer.id}`} className="block hover:underline">
                    {customer.phoneNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/customers/${customer.id}`} className="block hover:underline">
                    {customer.address || '-'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/customers/${customer.id}`} className="block hover:underline">
                    {customer.id}
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