// app/(main)/colors/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ColorsTable } from "./components/colors-table"
import { ColorsStats } from "./components/colors-stats"
import { ColorExportButton } from "./components/export-button"
import { getColorsAction } from "@/actions/colors"

export default async function ColorsPage() {
  // Fetch data server-side using existing actions
  const colorsResponse = await getColorsAction()
  const colors = colorsResponse.success ? colorsResponse.data || [] : []

  const stats = {
    totalColors: colors.length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Colors</h1>
            <p className="text-muted-foreground">Manage product colors</p>
          </div>
          <div className="flex gap-2">
            <ColorExportButton colors={colors} />
            <Button asChild>
              <Link href="/colors/create">
                <Plus className="mr-2 h-4 w-4" /> New Color
              </Link>
            </Button>
          </div>
        </div>

        <ColorsStats totalColors={stats.totalColors} />

        <div className="border rounded-lg p-2">
          <ColorsTable colors={colors} />
        </div>
      </main>
    </div>
  )
}