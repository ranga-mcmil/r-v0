// app/(main)/referral-payments/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import type { ReferralPaymentDTO } from "@/lib/http-service/referral-payments/types"

interface StatsProps {
  payments: ReferralPaymentDTO[]
}

export function Stats({ payments }: StatsProps) {
  const totalPayments = payments.length
  const pendingPayments = payments.filter(p => p.paymentStatus === 'PENDING').length
  const approvedPayments = payments.filter(p => p.paymentStatus === 'APPROVED').length
  const paidPayments = payments.filter(p => p.paymentStatus === 'PAID').length
  const totalAmount = payments.reduce((sum, p) => sum + p.referralAmount, 0)

  const stats: StatCard[] = [
    {
      title: "Total Payments",
      value: totalPayments,
      description: "All referral payments",
      icon: DollarSign,
    },
    {
      title: "Pending",
      value: pendingPayments,
      description: "Awaiting approval",
      icon: Clock,
    },
    {
      title: "Approved",
      value: approvedPayments,
      description: "Ready for payment",
      icon: CheckCircle,
    },
    {
      title: "Total Amount",
      value: `$${totalAmount.toFixed(2)}`,
      description: "All payment amounts",
      icon: DollarSign,
    },
  ]

  return <StatsCards stats={stats} />
}
