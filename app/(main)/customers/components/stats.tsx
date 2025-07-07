// app/(main)/customers/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Users } from "lucide-react"

interface StatsProps {
  totalCustomers: number
}

export function Stats({ totalCustomers }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "Registered customers",
      icon: Users,
    },
  ]

  return <StatsCards stats={stats} />
}
