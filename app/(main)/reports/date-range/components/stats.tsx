// app/(main)/reports/date-range/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { DollarSign, ShoppingCart, TrendingUp, BarChart3 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface DateRangeStatsProps {
  totalSales: number
  totalOrders: number
  avgOrderValue: number
  avgDailySales: number
  startDate: string
  endDate: string
}

export function DateRangeStats({ 
  totalSales, 
  totalOrders, 
  avgOrderValue, 
  avgDailySales,
  startDate,
  endDate 
}: DateRangeStatsProps) {
  const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

  const stats: StatCard[] = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      description: `Over ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`,
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
      title: "Daily Average",
      value: formatCurrency(avgDailySales),
      description: `Average sales per day`,
      icon: BarChart3,
    },
  ]

  return <StatsCards stats={stats} />
}
