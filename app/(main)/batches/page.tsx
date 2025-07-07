// app/(main)/batches/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BatchesTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getBatchesAction } from "@/actions/batches"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

export default async function BatchesPage() {
  // Get session for role-based access
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // For SALES_REP and MANAGER, filter by their branch
  const branchFilter = session.user.branchId ? { branchId: session.user.branchId } : undefined

  // Fetch data server-side using existing actions
  let batches: any[] = []
  
  try {
    const batchesResponse = await getBatchesAction(branchFilter)
    batches = (batchesResponse.success && batchesResponse.data) ? batchesResponse.data.content : []
  } catch (error) {
    console.error('Error fetching batches:', error)
    batches = []
  }

  const stats = {
    totalBatches: batches.length,
  }

  // Check if user can create batches (needs branch assignment)
  const canCreateBatch = session.user.role === 'ROLE_ADMIN' || session.user.branchId

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Batches</h1>
            <p className="text-muted-foreground">Manage production batches</p>
          </div>
          <div className="flex gap-2">
            <ExportButton batches={batches} />
            {canCreateBatch && (
              <Button asChild>
                <Link href="/batches/create">
                  <Plus className="mr-2 h-4 w-4" /> New Batch
                </Link>
              </Button>
            )}
          </div>
        </div>

        <Stats totalBatches={stats.totalBatches} />

        <div className="border rounded-lg p-2">
          <BatchesTable batches={batches} />
        </div>
      </main>
    </div>
  )
}
