// app/(main)/reports/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Package, DollarSign } from "lucide-react"
import { Stats } from "./components/stats"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const reportTypes = [
    {
      title: "Sales Detail Report",
      description: "Detailed sales information with customer and product details",
      icon: DollarSign,
      href: "/reports/sales-detail",
      color: "text-green-600"
    },
    {
      title: "Sales Summary",
      description: "High-level sales performance and trends",
      icon: TrendingUp,
      href: "/reports/sales-summary",
      color: "text-blue-600"
    },
    {
      title: "Inventory Report",
      description: "Stock levels and inventory movements",
      icon: Package,
      href: "/reports/inventory",
      color: "text-purple-600"
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and view business reports</p>
          </div>
        </div>

        <Stats />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const IconComponent = report.icon
            return (
              <Card key={report.href} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <IconComponent className={`h-5 w-5 ${report.color}`} />
                    {report.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link href={report.href}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}