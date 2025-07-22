// app/(main)/orders/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { ShoppingCart, FileText, CreditCard, CheckCircle, Clock } from "lucide-react"

interface StatsProps {
  totalOrders: number
  quotations: number
  layawayOrders: number
  completedOrders: number
  pendingOrders: number
}

export function Stats({ 
  totalOrders, 
  quotations, 
  layawayOrders, 
  completedOrders, 
  pendingOrders 
}: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Orders",
      value: totalOrders,
      description: "All orders & quotations",
      icon: ShoppingCart,
    },
    {
      title: "Quotations",
      value: quotations,
      description: "Price estimates",
      icon: FileText,
    },
    {
      title: "Layaway Orders",
      value: layawayOrders,
      description: "Payment plan orders",
      icon: CreditCard,
    },
    {
      title: "Completed",
      value: completedOrders,
      description: "Finished orders",
      icon: CheckCircle,
    },
    {
      title: "Pending",
      value: pendingOrders,
      description: "Awaiting completion",
      icon: Clock,
    },
  ]

  return <StatsCards stats={stats} />
}