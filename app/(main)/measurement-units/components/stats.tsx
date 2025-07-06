// app/(main)/measurement-units/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Ruler } from "lucide-react"

interface StatsProps {
  totalMeasurementUnits: number
}

export function Stats({ totalMeasurementUnits }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Units",
      value: totalMeasurementUnits,
      description: "Available measurement units",
      icon: Ruler,
    },
  ]

  return <StatsCards stats={stats} />
}