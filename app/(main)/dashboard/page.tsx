// app/(main)/dashboard/page.tsx
import { BarChart3, TrendingUp, Users, Package } from "lucide-react"
import { Stats } from "./components/stats"
import { RecentSalesTable } from "./components/recent-sales-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getDashboardAction } from "@/actions/dashboard"

export default async function DashboardPage() {
  // Fetch data server-side using existing action
  let dashboardData = {
    saleCount: 0,
    productCount: 0,
    customerCount: 0,
    referralCount: 0,
    recentSales: []
  }
  
  try {
    const dashboardResponse = await getDashboardAction()
    dashboardData = (dashboardResponse.success && dashboardResponse.data) 
      ? dashboardResponse.data 
      : dashboardData
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
          </div>
        </div>

        <Stats 
          saleCount={dashboardData.saleCount}
          productCount={dashboardData.productCount}
          customerCount={dashboardData.customerCount}
          referralCount={dashboardData.referralCount}
        />

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Sales</h2>
            <Button variant="outline" asChild>
              <Link href="/orders">
                View All Orders
              </Link>
            </Button>
          </div>
          <RecentSalesTable recentSales={dashboardData.recentSales} />
        </div>
      </main>
    </div>
  )
}