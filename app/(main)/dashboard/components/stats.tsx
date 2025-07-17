// app/(main)/dashboard/components/stats.tsx
import { StatsCards, StatCard } from "@/components/stats/stats-cards"
import { BarChart3, Package, Users, UserCheck } from "lucide-react"

interface StatsProps {
  saleCount: number
  productCount: number
  customerCount: number
  referralCount: number
}

export function Stats({ saleCount, productCount, customerCount, referralCount }: StatsProps) {
  const stats: StatCard[] = [
    {
      title: "Total Sales",
      value: saleCount,
      description: "Orders processed",
      icon: BarChart3,
    },
    {
      title: "Products",
      value: productCount,
      description: "Available in inventory",
      icon: Package,
    },
    {
      title: "Customers",
      value: customerCount,
      description: "Registered customers",
      icon: Users,
    },
    {
      title: "Referrals",
      value: referralCount,
      description: "Active referrals",
      icon: UserCheck,
    },
  ]

  return <StatsCards stats={stats} />
}