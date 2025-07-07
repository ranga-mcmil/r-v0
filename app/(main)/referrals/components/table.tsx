// app/(main)/referrals/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { ReferralDTO } from "@/lib/http-service/referrals/types"

interface ReferralsTableProps {
  referrals: ReferralDTO[]
}

export function ReferralsTable({ referrals = [] }: ReferralsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!referrals || referrals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No referrals found.
              </TableCell>
            </TableRow>
          ) : (
            referrals.map((referral) => (
              <TableRow key={referral.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/referrals/${referral.id}`} className="block hover:underline">
                    {referral.fullName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referrals/${referral.id}`} className="block hover:underline">
                    {referral.phoneNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referrals/${referral.id}`} className="block hover:underline">
                    {referral.address || '-'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referrals/${referral.id}`} className="block hover:underline">
                    {referral.id}
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
