// app/(main)/users/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Users, UserCheck, UserX } from "lucide-react"

interface StatsProps {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
}

export function Stats({ totalUsers, activeUsers, inactiveUsers }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "All system users",
      icon: Users,
    },
    {
      title: "Active Users",
      value: activeUsers,
      description: "Currently active",
      icon: UserCheck,
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      description: "Deactivated users",
      icon: UserX,
    },
  ]

  return <StatsCards stats={stats} />
}