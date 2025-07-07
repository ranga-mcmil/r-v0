// app/(main)/customers/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CustomersTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getCustomersAction } from "@/actions/customers"

export default async function CustomersPage() {
  // Fetch data server-side using existing actions
  let customers: any[] = []
  
  try {
    const customersResponse = await getCustomersAction()
    customers = (customersResponse.success && customersResponse.data) ? customersResponse.data.content : []
  } catch (error) {
    console.error('Error fetching customers:', error)
    customers = []
  }

  const stats = {
    totalCustomers: customers.length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage customer information</p>
          </div>
          <div className="flex gap-2">
            <ExportButton customers={customers} />
            <Button asChild>
              <Link href="/customers/create">
                <Plus className="mr-2 h-4 w-4" /> New Customer
              </Link>
            </Button>
          </div>
        </div>

        <Stats totalCustomers={stats.totalCustomers} />

        <div className="border rounded-lg p-2">
          <CustomersTable customers={customers} />
        </div>
      </main>
    </div>
  )
}