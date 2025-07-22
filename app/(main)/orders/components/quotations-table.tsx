// app/(main)/orders/components/quotations-table.tsx
import { getAllOrdersAction } from "@/actions/orders"
import { OrdersTable } from "../components/table"
import { QuotationFilters } from "./quotation-filters"
import { ExportButton } from "./export-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Clock } from "lucide-react"

interface QuotationsTableProps {
  searchParams?: {
    status?: string
    customerName?: string
    orderNumber?: string
    startDate?: string
    endDate?: string
    page?: string
    size?: string
    sortBy?: string
    sortDir?: string
  }
}

export async function QuotationsTable({ searchParams }: QuotationsTableProps) {
  // Build query parameters specifically for quotations
  const queryParams = {
    pageNo: searchParams?.page ? parseInt(searchParams.page) - 1 : 0,
    pageSize: searchParams?.size ? parseInt(searchParams.size) : 10,
    sortBy: searchParams?.sortBy || 'createdDate',
    sortDir: (searchParams?.sortDir as 'asc' | 'desc') || 'desc',
    orderType: 'QUOTATION' as any, // Force quotations only
    status: searchParams?.status as any,
    customerName: searchParams?.customerName,
    orderNumber: searchParams?.orderNumber,
    startDate: searchParams?.startDate,
    endDate: searchParams?.endDate,
  }

  let quotations: any[] = []
  let totalElements = 0
  let totalPages = 0
  let stats = {
    pending: 0,
    converted: 0,
    totalValue: 0
  }
  
  try {
    const ordersResponse = await getAllOrdersAction(queryParams)
    if (ordersResponse.success && ordersResponse.data) {
      quotations = ordersResponse.data.content
      totalElements = ordersResponse.data.totalElements
      totalPages = ordersResponse.data.totalPages
      
      // Calculate quotation stats
      stats.pending = quotations.filter(q => q.status === 'PENDING').length
      stats.converted = quotations.filter(q => q.status !== 'PENDING').length
      stats.totalValue = quotations.reduce((sum, q) => sum + q.totalAmount, 0)
    }
  } catch (error) {
    console.error('Error fetching quotations:', error)
  }

  const currentPage = (queryParams.pageNo || 0) + 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quotations</h2>
        <ExportButton orders={quotations} filename="quotations_export" />
      </div>

      {/* Quotation Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotations</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <CardDescription>Awaiting customer response</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.converted}</div>
            <CardDescription>Converted to orders</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <CardDescription>Combined quotation value</CardDescription>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <QuotationFilters currentParams={searchParams || {}} />
      
      {/* Quotations Table */}
      <div className="border rounded-lg p-2">
        <OrdersTable 
          orders={quotations} 
          totalPages={totalPages}
          currentPage={currentPage}
          totalElements={totalElements}
          baseUrl="/orders?tab=quotations"
          showConvertActions={true}
        />
      </div>
    </div>
  )
}