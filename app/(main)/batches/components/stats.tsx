// app/(main)/batches/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Package } from "lucide-react"

interface StatsProps {
  totalBatches: number
}

export function Stats({ totalBatches }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Batches",
      value: totalBatches,
      description: "Production batches",
      icon: Package,
    },
  ]

  return <StatsCards stats={stats} />
}