// app/(main)/colors/components/colors-stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Palette } from "lucide-react"

interface ColorsStatsProps {
  totalColors: number
}

export function ColorsStats({ totalColors }: ColorsStatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Colors",
      value: totalColors,
      description: "Available color options",
      icon: Palette,
    },
  ]

  return <StatsCards stats={stats} />
}