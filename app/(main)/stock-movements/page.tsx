// app/(main)/stock-movements/page.tsx
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { StockMovementsTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getAllStockMovementsAction } from "@/actions/stock-movements"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

export default async function StockMovementsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  let movements: any[] = []
  
  try {
    const movementsResponse = await getAllStockMovementsAction()
    movements = (movementsResponse.success && movementsResponse.data) ? movementsResponse.data.content : []
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    movements = []
  }

  const inboundMovements = movements.filter(m => m.quantity > 0).length
  const outboundMovements = movements.filter(m => m.quantity < 0).length
  const reversedMovements = movements.filter(m => m.reversed).length

  const stats = {
    totalMovements: movements.length,
    inboundMovements,
    outboundMovements,
    reversedMovements,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock Movements</h1>
            <p className="text-muted-foreground">Track all inventory movements and changes</p>
          </div>
          <div className="flex gap-2">
            <ExportButton movements={movements} />
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </div>

        <Stats 
          totalMovements={stats.totalMovements}
          inboundMovements={stats.inboundMovements}
          outboundMovements={stats.outboundMovements}
          reversedMovements={stats.reversedMovements}
        />

        <div className="border rounded-lg p-2">
          <StockMovementsTable movements={movements} />
        </div>
      </main>
    </div>
  )
}