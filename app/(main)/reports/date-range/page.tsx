// app/(main)/reports/date-range/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import { DateRangeReportsTable } from "./components/table"
import { DateRangeStats } from "./components/stats"
import { DateRangeExportButton } from "./components/export-button"
import { DateRangeFilter } from "./components/date-range-filter"
import { getSalesDetailReportByDateRangeAction } from "@/actions/reports"

interface DateRangeReportsPageProps {
  searchParams: {
    startDate?: string
    endDate?: string
  }
}

export default async function DateRangeReportsPage({ searchParams }: DateRangeReportsPageProps) {
  // Default to last 7 days if no dates provided
  const defaultEndDate = new Date().toISOString().split('T')[0]
  const defaultStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const startDate = searchParams.startDate || defaultStartDate
  const endDate = searchParams.endDate || defaultEndDate

  // Fetch data server-side using existing action
  let reports: any[] = []
  let hasError = false
  
  try {
    if (startDate && endDate) {
      const reportsResponse = await getSalesDetailReportByDateRangeAction(startDate, endDate)
      
      if (reportsResponse.success && reportsResponse.data) {
        reports = reportsResponse.data || []
      } else {
        hasError = true
      }
    }
  } catch (error) {
    console.error('Error fetching date range reports:', error)
    hasError = true
  }

  // Calculate stats
  const totalSales = reports.reduce((sum, report) => sum + (report.total || 0), 0)
  const totalOrders = reports.length
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
  
  // Group by date for daily breakdown
  const dailyBreakdown = reports.reduce((acc, report) => {
    const date = report.date
    if (!acc[date]) {
      acc[date] = { orders: 0, sales: 0 }
    }
    acc[date].orders += 1
    acc[date].sales += report.total || 0
    return acc
  }, {} as Record<string, { orders: number; sales: number }>)

  const avgDailySales = Object.keys(dailyBreakdown).length > 0 
    ? totalSales / Object.keys(dailyBreakdown).length 
    : 0

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/reports">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Date Range Sales Report</h1>
              <p className="text-muted-foreground">
                Sales data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DateRangeExportButton 
              reports={reports} 
              startDate={startDate} 
              endDate={endDate} 
            />
            <Button variant="outline" asChild>
              <Link href="/reports">
                <Calendar className="mr-2 h-4 w-4" /> Single Date Report
              </Link>
            </Button>
          </div>
        </div>

        <DateRangeStats 
          totalSales={totalSales}
          totalOrders={totalOrders}
          avgOrderValue={avgOrderValue}
          avgDailySales={avgDailySales}
          startDate={startDate}
          endDate={endDate}
        />

        <DateRangeFilter 
          currentStartDate={startDate} 
          currentEndDate={endDate}
        />

        {hasError ? (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Error loading reports. Please try again or select different dates.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-2">
            <DateRangeReportsTable 
              reports={reports}
              startDate={startDate}
              endDate={endDate}
              dailyBreakdown={dailyBreakdown}
            />
          </div>
        )}
      </main>
    </div>
  )
}
