// app/(main)/inventory/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown, History } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InventoryTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getInventoryAdjustmentsAction } from "@/actions/inventory"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

export default async function InventoryPage() {
  // Get session for role-based access
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Fetch data server-side using existing actions
  let inventory: any[] = []
  
  try {
    const inventoryResponse = await getInventoryAdjustmentsAction()
    inventory = (inventoryResponse.success && inventoryResponse.data) ? inventoryResponse.data.content : []
  } catch (error) {
    console.error('Error fetching inventory:', error)
    inventory = []
  }

  // Calculate stats
  const stockAdditions = inventory.filter(item => item.movementType === 'STOCK_ADDITION').length
  const stockAdjustments = inventory.filter(item => item.movementType !== 'STOCK_ADDITION').length
  const lowStockItems = inventory.filter(item => item.totalStockQuantity <= 10).length

  const stats = {
    totalMovements: inventory.length,
    stockAdditions,
    stockAdjustments,
    lowStockItems,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Track and manage inventory movements</p>
          </div>
          <div className="flex gap-2">
            <ExportButton inventory={inventory} />
            
            {/* Inventory Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Inventory Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Inventory Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/inventory/add">
                    <Plus className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Add Inventory</span>
                      <span className="text-xs text-muted-foreground">Add new stock</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/inventory/adjust">
                    <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Adjust Stock</span>
                      <span className="text-xs text-muted-foreground">Increase or decrease</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/inventory/history">
                    <History className="mr-2 h-4 w-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span>View History</span>
                      <span className="text-xs text-muted-foreground">All movements</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Stats 
          totalMovements={stats.totalMovements}
          stockAdditions={stats.stockAdditions}
          stockAdjustments={stats.stockAdjustments}
          lowStockItems={stats.lowStockItems}
        />

        <div className="border rounded-lg p-2">
          <InventoryTable inventory={inventory} />
        </div>
      </main>
    </div>
  )
}