// app/(main)/stock-movements/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Activity, TrendingUp, TrendingDown, RotateCcw } from "lucide-react"

interface StatsProps {
  totalMovements: number
  inboundMovements: number
  outboundMovements: number
  reversedMovements: number
}

export function Stats({ 
  totalMovements, 
  inboundMovements, 
  outboundMovements, 
  reversedMovements 
}: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Movements",
      value: totalMovements,
      description: "All stock movements",
      icon: Activity,
    },
    {
      title: "Inbound Movements",
      value: inboundMovements,
      description: "Stock additions & increases",
      icon: TrendingUp,
    },
    {
      title: "Outbound Movements",
      value: outboundMovements,
      description: "Sales & decreases",
      icon: TrendingDown,
    },
    {
      title: "Reversed Movements",
      value: reversedMovements,
      description: "Cancelled movements",
      icon: RotateCcw,
    },
  ]

  return <StatsCards stats={stats} />
}