// app/(main)/inventory/history/page.tsx
import { Button } from "@/components/ui/button"
import { ArrowLeft, History } from "lucide-react"
import Link from "next/link"
import { InventoryTable } from "../components/table"
import { ExportButton } from "../components/export-button"
import { getInventoryAdjustmentsAction } from "@/actions/inventory"

export default async function AllInventoryHistoryPage() {
  // Fetch data server-side using existing actions
  let inventory: any[] = []
  
  try {
    const inventoryResponse = await getInventoryAdjustmentsAction()
    inventory = (inventoryResponse.success && inventoryResponse.data) ? inventoryResponse.data.content : []
  } catch (error) {
    console.error('Error fetching inventory history:', error)
    inventory = []
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/inventory">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <h1 className="text-2xl font-bold">All Inventory History</h1>
              </div>
              <p className="text-muted-foreground">Complete history of all inventory movements</p>
            </div>
          </div>
          <ExportButton inventory={inventory} />
        </div>

        <div className="border rounded-lg p-2">
          <InventoryTable inventory={inventory} />
        </div>
      </main>
    </div>
  )
}