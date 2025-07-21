import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"
import { ReportsTable } from "./components/table"
import { ReportsStats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { DateFilter } from "./components/date-filter"
import { getSalesDetailReportPaginatedAction } from "@/actions/reports"

interface ReportsPageProps {
  searchParams: {
    date?: string
    pageNo?: string
    pageSize?: string
  }
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const currentDate = searchParams.date || new Date().toISOString().split('T')[0]
  const pageNo = parseInt(searchParams.pageNo || '0')
  const pageSize = parseInt(searchParams.pageSize || '20')

  // Fetch data server-side using existing action
  let reports: any[] = []
  let pagination = {
    totalElements: 0,
    totalPages: 0,
    pageNo: 0,
    pageSize: 20,
    last: false
  }
  
  try {
    const reportsResponse = await getSalesDetailReportPaginatedAction(currentDate, pageNo, pageSize)
    
    if (reportsResponse.success && reportsResponse.data) {
      reports = reportsResponse.data.content || []
      pagination = {
        totalElements: reportsResponse.data.totalElements || 0,
        totalPages: reportsResponse.data.totalPages || 0,
        pageNo: reportsResponse.data.pageNo || 0,
        pageSize: reportsResponse.data.pageSize || 20,
        last: reportsResponse.data.last || false
      }
    }
  } catch (error) {
    console.error('Error fetching reports:', error)
  }

  // Calculate stats
  const totalSales = reports.reduce((sum, report) => sum + (report.total || 0), 0)
  const totalOrders = reports.length
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sales Reports</h1>
            <p className="text-muted-foreground">View detailed sales reports and analytics</p>
          </div>
          <div className="flex gap-2">
            <ExportButton reports={reports} currentDate={currentDate} />
            <Button variant="outline" asChild>
              <Link href="/reports/date-range">
                <Calendar className="mr-2 h-4 w-4" /> Date Range Report
              </Link>
            </Button>
          </div>
        </div>

        <ReportsStats 
          totalSales={totalSales}
          totalOrders={totalOrders}
          avgOrderValue={avgOrderValue}
          reportDate={currentDate}
        />

        <DateFilter currentDate={currentDate} />

        <div className="border rounded-lg p-2">
          <ReportsTable 
            reports={reports} 
            pagination={pagination}
            currentDate={currentDate}
          />
        </div>
      </main>
    </div>
  )
}