// app/(main)/inventory/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface StatsProps {
  totalMovements: number
  stockAdditions: number
  stockAdjustments: number
  lowStockItems: number
}

export function Stats({ totalMovements, stockAdditions, stockAdjustments, lowStockItems }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Movements",
      value: totalMovements,
      description: "All inventory movements",
      icon: Package,
    },
    {
      title: "Stock Additions",
      value: stockAdditions,
      description: "New stock added",
      icon: TrendingUp,
    },
    {
      title: "Adjustments",
      value: stockAdjustments,
      description: "Inventory adjustments",
      icon: TrendingDown,
    },
    {
      title: "Low Stock Alert",
      value: lowStockItems,
      description: "Items needing attention",
      icon: AlertTriangle,
    },
  ]

  return <StatsCards stats={stats} />
}