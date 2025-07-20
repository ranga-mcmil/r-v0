// app/(main)/reports/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { FileText, Calendar, TrendingUp, Users } from "lucide-react"

export function Stats() {
  const stats: StatCard[] = [
    {
      title: "Available Reports",
      value: 3,
      description: "Report types available",
      icon: FileText,
    },
    {
      title: "This Month",
      value: "45",
      description: "Reports generated",
      icon: Calendar,
    },
    {
      title: "Performance",
      value: "↑ 12%",
      description: "vs last month",
      icon: TrendingUp,
    },
    {
      title: "Active Users",
      value: "8",
      description: "Using reports",
      icon: Users,
    },
  ]

  return <StatsCards stats={stats} />
}
