// app/(main)/users/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { UserDTO } from "@/lib/http-service/users/types"

interface UsersTableProps {
  users: UserDTO[]
}

export function UsersTable({ users = [] }: UsersTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!users || users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/users/${user.id}`} className="block hover:underline">
                    {user.firstName} {user.lastName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/users/${user.id}`} className="block hover:underline">
                    {user.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/users/${user.id}`} className="block hover:underline">
                    <Badge variant="secondary">
                      {user.role.replace('ROLE_', '').replace('_', ' ')}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/users/${user.id}`} className="block hover:underline">
                    {user.branchName || '-'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/users/${user.id}`} className="block hover:underline">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/users/${user.id}`} className="block hover:underline">
                    {user.id}
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