// app/(main)/measurement-units/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MeasurementUnitsTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getMeasurementUnitsAction } from "@/actions/measurement-units"

export default async function MeasurementUnitsPage() {
  // Fetch data server-side using existing actions
  let measurementUnits: any[] = []
  
  try {
    const measurementUnitsResponse = await getMeasurementUnitsAction()
    measurementUnits = (measurementUnitsResponse.success && measurementUnitsResponse.data) ? measurementUnitsResponse.data : []
  } catch (error) {
    console.error('Error fetching measurement units:', error)
    measurementUnits = []
  }

  const stats = {
    totalMeasurementUnits: measurementUnits.length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Measurement Units</h1>
            <p className="text-muted-foreground">Manage units of measurement</p>
          </div>
          <div className="flex gap-2">
            <ExportButton measurementUnits={measurementUnits} />
            <Button asChild>
              <Link href="/measurement-units/create">
                <Plus className="mr-2 h-4 w-4" /> New Unit
              </Link>
            </Button>
          </div>
        </div>

        <Stats totalMeasurementUnits={stats.totalMeasurementUnits} />

        <div className="border rounded-lg p-2">
          <MeasurementUnitsTable measurementUnits={measurementUnits} />
        </div>
      </main>
    </div>
  )
}