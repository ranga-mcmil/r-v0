// app/(main)/measurement-units/edit/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMeasurementUnitAction } from "@/actions/measurement-units"
import { FormClient } from "../../components/form-client"

interface EditMeasurementUnitPageProps {
  params: {
    id: string
  }
}

export default async function EditMeasurementUnitPage({ params }: EditMeasurementUnitPageProps) {
  const measurementUnitId = parseInt(params.id)

  if (isNaN(measurementUnitId)) {
    notFound()
  }

  // Fetch measurement unit data server-side using existing action
  const measurementUnitResponse = await getMeasurementUnitAction(measurementUnitId)
  
  if (!measurementUnitResponse.success || !measurementUnitResponse.data) {
    notFound()
  }

  const measurementUnit = measurementUnitResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/measurement-units/${measurementUnitId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Unit: {measurementUnit.unitOfMeasure}</h1>
            <p className="text-muted-foreground">Update measurement unit information</p>
          </div>
        </div>

        <Card className="p-6">
          <FormClient measurementUnit={measurementUnit} returnUrl={`/measurement-units/${measurementUnitId}`} />
        </Card>
      </main>
    </div>
  )
}