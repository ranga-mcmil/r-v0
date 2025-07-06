// app/(main)/thicknesses/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getThicknessAction } from "@/actions/thicknesses"
import { Actions } from "../components/actions"

interface ThicknessDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ThicknessDetailsPage({ params }: ThicknessDetailsPageProps) {
  const thicknessId = parseInt(params.id)

  if (isNaN(thicknessId)) {
    notFound()
  }

  // Fetch data server-side using existing action
  const thicknessResponse = await getThicknessAction(thicknessId)
  
  if (!thicknessResponse.success || !thicknessResponse.data) {
    notFound()
  }

  const thickness = thicknessResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/thicknesses">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{thickness.thickness}mm</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Thickness ID: {thickness.id}</span>
              </div>
            </div>
          </div>
          <Actions thicknessId={thickness.id} thicknessValue={thickness.thickness} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Thickness Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h3 className="font-bold">{thickness.thickness}mm</h3>
                <div className="text-sm text-muted-foreground">ID: {thickness.id}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Products using this thickness:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="text-sm text-muted-foreground">No products found using this thickness</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}