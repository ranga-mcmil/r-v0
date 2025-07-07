// app/(main)/branches/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BranchesTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getBranchesAction, getBranchStatsAction } from "@/actions/branches"

export default async function BranchesPage() {
  // Fetch data server-side using existing actions
  let branches: any[] = []
  let stats = {
    totalBranches: 0,
    activeBranches: 0,
    inactiveBranches: 0,
    assignedUsers: 0,
  }
  
  try {
    const [branchesResponse, statsResponse] = await Promise.all([
      getBranchesAction(),
      getBranchStatsAction()
    ])
    
    branches = (branchesResponse.success && branchesResponse.data) ? branchesResponse.data.content : []
    
    if (statsResponse.success && statsResponse.data) {
      stats = {
        totalBranches: statsResponse.data.numberOfBranches,
        activeBranches: statsResponse.data.numberOfActiveBranches,
        inactiveBranches: statsResponse.data.numberOfInactiveBranches,
        assignedUsers: statsResponse.data.numberOfAssignedUsers,
      }
    }
  } catch (error) {
    console.error('Error fetching branches:', error)
    branches = []
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Branches</h1>
            <p className="text-muted-foreground">Manage branch locations and information</p>
          </div>
          <div className="flex gap-2">
            <ExportButton branches={branches} />
            <Button asChild>
              <Link href="/branches/create">
                <Plus className="mr-2 h-4 w-4" /> New Branch
              </Link>
            </Button>
          </div>
        </div>

        <Stats 
          totalBranches={stats.totalBranches}
          activeBranches={stats.activeBranches}
          inactiveBranches={stats.inactiveBranches}
          assignedUsers={stats.assignedUsers}
        />

        <div className="border rounded-lg p-2">
          <BranchesTable branches={branches} />
        </div>
      </main>
    </div>
  )
}