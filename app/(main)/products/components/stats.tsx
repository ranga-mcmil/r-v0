// app/(main)/products/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { Package, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface StatsProps {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  lowStockProducts: number
}

export function Stats({ totalProducts, activeProducts, inactiveProducts, lowStockProducts }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "All registered products",
      icon: Package,
    },
    {
      title: "Active Products",
      value: activeProducts,
      description: "Currently available",
      icon: CheckCircle,
    },
    {
      title: "Inactive Products",
      value: inactiveProducts,
      description: "Currently unavailable",
      icon: XCircle,
    },
    {
      title: "Low Stock",
      value: lowStockProducts,
      description: "Products with low inventory",
      icon: AlertTriangle,
    },
  ]

  return <StatsCards stats={stats} />
}