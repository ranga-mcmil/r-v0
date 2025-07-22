// app/(main)/orders/components/reports-section.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, FileText, Download, Calendar, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportFilters } from "./report-filters"
import { SalesReportChart } from "./sales-report-chart"
import { StockMovementsReport } from "./stock-movements-report"
import { OrderSummaryReport } from "./order-summary-report"
import Link from "next/link"

interface ReportsSectionProps {
  searchParams?: {
    reportType?: string
    startDate?: string
    endDate?: string
    branchId?: string
    productId?: string
  }
}

export async function ReportsSection({ searchParams }: ReportsSectionProps) {
  const reportType = searchParams?.reportType || 'summary'

  const reportTypes = [
    {
      id: 'summary',
      title: 'Order Summary',
      description: 'Overview of orders by type and status',
      icon: BarChart3
    },
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Revenue and sales performance',
      icon: TrendingUp
    },
    {
      id: 'stock-movements',
      title: 'Stock Movements',
      description: 'Inventory changes from orders',
      icon: FileText
    }
  ]

  const quickReports = [
    {
      title: "Today's Sales",
      description: "Sales report for today",
      icon: Calendar,
      href: "/orders/reports/sales?period=today"
    },
    {
      title: "Monthly Revenue",
      description: "Current month performance",
      icon: DollarSign,
      href: "/orders/reports/sales?period=month"
    },
    {
      title: "Top Products",
      description: "Best selling products",
      icon: TrendingUp,
      href: "/orders/reports/products?period=month"
    },
    {
      title: "Stock Impact",
      description: "Recent stock movements",
      icon: FileText,
      href: "/orders/reports/stock-movements?period=week"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reports & Analytics</h2>
        <Button variant="outline" asChild>
          <Link href="/reports">
            <FileText className="mr-2 h-4 w-4" />
            Advanced Reports
          </Link>
        </Button>
      </div>

      {/* Quick Report Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickReports.map((report, index) => {
          const Icon = report.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={report.href}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {report.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription>{report.description}</CardDescription>
                  <div className="flex items-center mt-2">
                    <Download className="h-3 w-3 mr-1" />
                    <span className="text-xs text-muted-foreground">Click to generate</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>

      {/* Report Filters */}
      <ReportFilters currentParams={searchParams || {}} />

      {/* Report Content */}
      <Tabs value={reportType} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {reportTypes.map((type) => {
            const Icon = type.icon
            return (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Order Summary Report
              </CardTitle>
              <CardDescription>
                Overview of orders by type, status, and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderSummaryReport searchParams={searchParams} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Performance Report
              </CardTitle>
              <CardDescription>
                Revenue trends, conversion rates, and sales analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesReportChart searchParams={searchParams} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock-movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Stock Movements Report
              </CardTitle>
              <CardDescription>
                Inventory changes and stock impact from order fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockMovementsReport searchParams={searchParams} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}