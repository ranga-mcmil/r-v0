// app/(main)/thicknesses/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ThicknessTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getThicknessesAction } from "@/actions/thicknesses"

export default async function ThicknessesPage() {
  // Fetch data server-side using existing actions
  const thicknessesResponse = await getThicknessesAction()
  const thicknesses = thicknessesResponse.success ? thicknessesResponse.data || [] : []

  const stats = {
    totalThicknesses: thicknesses.length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Thicknesses</h1>
            <p className="text-muted-foreground">Manage product thickness options</p>
          </div>
          <div className="flex gap-2">
            <ExportButton thicknesses={thicknesses} />
            <Button asChild>
              <Link href="/thicknesses/create">
                <Plus className="mr-2 h-4 w-4" /> New Thickness
              </Link>
            </Button>
          </div>
        </div>

        <Stats totalThicknesses={stats.totalThicknesses} />

        <div className="border rounded-lg p-2">
          <ThicknessTable thicknesses={thicknesses} />
        </div>
      </main>
    </div>
  )
}