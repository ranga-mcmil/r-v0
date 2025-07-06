// Updated warehouse stats using generic component
// app/(main)/warehouses/components/warehouses-stats.tsx  
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { FileText, Calendar } from "lucide-react"

interface WarehousesStatsProps {
  totalWarehouses: number
  activeWarehouses: number
  inactiveWarehouses: number
  totalUsers: number
  filteredCount?: number
}

export function WarehousesStats({
  totalWarehouses,
  activeWarehouses,
  inactiveWarehouses,
  totalUsers,
  filteredCount,
}: WarehousesStatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Warehouses",
      value: filteredCount ?? totalWarehouses,
      description: filteredCount !== undefined && filteredCount !== totalWarehouses
        ? `Filtered from ${totalWarehouses} total`
        : "All warehouses",
      icon: FileText,
    },
    {
      title: "Active Warehouses", 
      value: activeWarehouses,
      description: "Ready for operations",
      icon: FileText,
    },
    {
      title: "Inactive Warehouses",
      value: inactiveWarehouses, 
      description: "Not currently in use",
      icon: Calendar,
    },
    {
      title: "Assigned Users",
      value: totalUsers,
      description: "Total users assigned", 
      icon: Calendar,
    },
  ]

  return <StatsCards stats={stats} />
}
