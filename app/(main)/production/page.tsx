// app/(main)/production/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductionTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getProductionsByBranchIdAction } from "@/actions/productions"

export default async function ProductionPage() {
  // Fetch data server-side using existing action
  let productions: any[] = []
  
  try {
    const productionsResponse = await getProductionsByBranchIdAction()
    productions = (productionsResponse.success && productionsResponse.data) ? productionsResponse.data.content : []
  } catch (error) {
    console.error('Error fetching productions:', error)
    productions = []
  }

  // Calculate stats from the fetched data
  const completedProductions = productions.filter(p => p.status === 'completed').length
  const pendingProductions = productions.filter(p => p.status === 'pending').length
  const totalQuantity = productions.reduce((sum, p) => sum + (p.quantity || 0), 0)

  const stats = {
    totalProductions: productions.length,
    completedProductions,
    pendingProductions,
    totalQuantity,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Production</h1>
            <p className="text-muted-foreground">Track and manage production records</p>
          </div>
          <div className="flex gap-2">
            <ExportButton productions={productions} />
            <Button asChild>
              <Link href="/production/create">
                <Plus className="mr-2 h-4 w-4" /> New Production
              </Link>
            </Button>
          </div>
        </div>

        <Stats 
          totalProductions={stats.totalProductions}
          completedProductions={stats.completedProductions}
          pendingProductions={stats.pendingProductions}
          totalQuantity={stats.totalQuantity}
        />

        <div className="border rounded-lg p-2">
          <ProductionTable productions={productions} />
        </div>
      </main>
    </div>
  )
}