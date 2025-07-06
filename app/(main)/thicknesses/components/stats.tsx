// app/(main)/thicknesses/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Layers } from "lucide-react"

interface StatsProps {
  totalThicknesses: number
}

export function Stats({ totalThicknesses }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Thicknesses",
      value: totalThicknesses,
      description: "Available thickness options",
      icon: Layers,
    },
  ]

  return <StatsCards stats={stats} />
}