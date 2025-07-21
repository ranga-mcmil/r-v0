// app/(main)/reports/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ReportsStatsProps {
  totalSales: number
  totalOrders: number
  avgOrderValue: number
  reportDate: string
}

export function ReportsStats({ totalSales, totalOrders, avgOrderValue, reportDate }: ReportsStatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      description: `Sales for ${reportDate}`,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders,
      description: `Orders processed`,
      icon: ShoppingCart,
    },
    {
      title: "Average Order Value",
      value: formatCurrency(avgOrderValue),
      description: `Per order average`,
      icon: TrendingUp,
    },
    {
      title: "Report Date",
      value: new Date(reportDate).toLocaleDateString(),
      description: "Selected date range",
      icon: Calendar,
    },
  ]

  return <StatsCards stats={stats} />
}