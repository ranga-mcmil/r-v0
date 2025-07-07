// app/(main)/branches/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Building, CheckCircle, XCircle, Users } from "lucide-react"

interface StatsProps {
  totalBranches: number
  activeBranches: number
  inactiveBranches: number
  assignedUsers: number
}

export function Stats({ totalBranches, activeBranches, inactiveBranches, assignedUsers }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Branches",
      value: totalBranches,
      description: "All registered branches",
      icon: Building,
    },
    {
      title: "Active Branches",
      value: activeBranches,
      description: "Currently operational",
      icon: CheckCircle,
    },
    {
      title: "Inactive Branches",
      value: inactiveBranches,
      description: "Currently closed",
      icon: XCircle,
    },
    {
      title: "Assigned Users",
      value: assignedUsers,
      description: "Users with branch assignments",
      icon: Users,
    },
  ]

  return <StatsCards stats={stats} />
}