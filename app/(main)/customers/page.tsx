// app/(main)/customers/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Users, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
            
            {/* Customer Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  Related
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Customer Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/referrals">
                    <Users className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Manage Referrals</span>
                      <span className="text-xs text-muted-foreground">View referral partners</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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