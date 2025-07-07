// app/(main)/referrals/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Users } from "lucide-react"

interface StatsProps {
  totalReferrals: number
}

export function Stats({ totalReferrals }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Referrals",
      value: totalReferrals,
      description: "Registered referrals",
      icon: Users,
    },
  ]

  return <StatsCards stats={stats} />
}