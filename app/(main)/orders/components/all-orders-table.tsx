// app/(main)/orders/components/all-orders-table.tsx
import { getAllOrdersAction } from "@/actions/orders"
import { OrdersTable } from "../components/table"
import { OrderFilters } from "./order-filters"
import { ExportButton } from "./export-button"

interface AllOrdersTableProps {
  searchParams?: {
    orderType?: string
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

export async function AllOrdersTable({ searchParams }: AllOrdersTableProps) {
  // Build query parameters
  const queryParams = {
    pageNo: searchParams?.page ? parseInt(searchParams.page) - 1 : 0,
    pageSize: searchParams?.size ? parseInt(searchParams.size) : 10,
    sortBy: searchParams?.sortBy || 'createdDate',
    sortDir: (searchParams?.sortDir as 'asc' | 'desc') || 'desc',
    orderType: searchParams?.orderType as any,
    status: searchParams?.status as any,
    customerName: searchParams?.customerName,
    orderNumber: searchParams?.orderNumber,
    startDate: searchParams?.startDate,
    endDate: searchParams?.endDate,
  }

  let orders: any[] = []
  let totalElements = 0
  let totalPages = 0
  
  try {
    const ordersResponse = await getAllOrdersAction(queryParams)
    if (ordersResponse.success && ordersResponse.data) {
      orders = ordersResponse.data.content
      totalElements = ordersResponse.data.totalElements
      totalPages = ordersResponse.data.totalPages
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  }

  const currentPage = (queryParams.pageNo || 0) + 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Orders</h2>
        <ExportButton orders={orders} filename="all_orders_export" />
      </div>
      
      {/* Filters */}
      <OrderFilters currentParams={searchParams || {}} />
      
      {/* Orders Table */}
      <div className="border rounded-lg p-2">
        <OrdersTable 
          orders={orders} 
          totalPages={totalPages}
          currentPage={currentPage}
          totalElements={totalElements}
          baseUrl="/orders?tab=all"
        />
      </div>
    </div>
  )
}