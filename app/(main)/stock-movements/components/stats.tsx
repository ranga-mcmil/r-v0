// app/(main)/stock-movements/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { TrendingUp, TrendingDown, RefreshCw, AlertTriangle } from "lucide-react"

interface StatsProps {
  totalMovements: number
  inboundMovements: number
  outboundMovements: number
  reversedMovements: number
}

export function Stats({ totalMovements, inboundMovements, outboundMovements, reversedMovements }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Movements",
      value: totalMovements,
      description: "All stock movements",
      icon: RefreshCw,
    },
    {
      title: "Inbound",
      value: inboundMovements,
      description: "Stock increases",
      icon: TrendingUp,
    },
    {
      title: "Outbound",
      value: outboundMovements,
      description: "Stock decreases",
      icon: TrendingDown,
    },
    {
      title: "Reversed",
      value: reversedMovements,
      description: "Cancelled movements",
      icon: AlertTriangle,
    },
  ]

  return <StatsCards stats={stats} />
}
