// app/(main)/referral-payments/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { ReferralPaymentDTO } from "@/lib/http-service/referral-payments/types"

interface ReferralPaymentsTableProps {
  payments: ReferralPaymentDTO[]
}

export function ReferralPaymentsTable({ payments = [] }: ReferralPaymentsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referral</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!payments || payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No referral payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/referral-payments/${payment.id}`} className="block hover:underline">
                    {payment.fullName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referral-payments/${payment.id}`} className="block hover:underline">
                    ${payment.referralAmount.toFixed(2)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referral-payments/${payment.id}`} className="block hover:underline">
                    {payment.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referral-payments/${payment.id}`} className="block hover:underline">
                    {payment.orderStatus}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referral-payments/${payment.id}`} className="block hover:underline">
                    <Badge className={getStatusColor(payment.paymentStatus)}>
                      {payment.paymentStatus}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/referral-payments/${payment.id}`} className="block hover:underline">
                    {payment.id}
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
