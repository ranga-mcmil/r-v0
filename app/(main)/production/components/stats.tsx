// app/(main)/production/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Factory, Package, CheckCircle, Clock } from "lucide-react"

interface StatsProps {
  totalProductions: number
  completedProductions: number
  pendingProductions: number
  totalQuantity: number
}

export function Stats({ totalProductions, completedProductions, pendingProductions, totalQuantity }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Productions",
      value: totalProductions,
      description: "All production records",
      icon: Factory,
    },
    {
      title: "Completed",
      value: completedProductions,
      description: "Finished productions",
      icon: CheckCircle,
    },
    {
      title: "Pending",
      value: pendingProductions,
      description: "In progress",
      icon: Clock,
    },
    {
      title: "Total Quantity",
      value: totalQuantity,
      description: "Units produced",
      icon: Package,
    },
  ]

  return <StatsCards stats={stats} />
}
