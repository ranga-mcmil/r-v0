// app/(main)/categories/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { FolderOpen } from "lucide-react"

interface StatsProps {
  totalCategories: number
}

export function Stats({ totalCategories }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Categories",
      value: totalCategories,
      description: "Available product categories",
      icon: FolderOpen,
    },
  ]

  return <StatsCards stats={stats} />
}