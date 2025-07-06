// app/(main)/measurement-units/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getMeasurementUnitAction, deleteMeasurementUnitAction } from "@/actions/measurement-units"
import { notFound } from "next/navigation"

interface DeleteMeasurementUnitPageProps {
  params: {
    id: string
  }
}

export default async function DeleteMeasurementUnitPage({ params }: DeleteMeasurementUnitPageProps) {
  const measurementUnitId = parseInt(params.id)

  if (isNaN(measurementUnitId)) {
    notFound()
  }

  // Find the measurement unit using existing action
  const measurementUnitResponse = await getMeasurementUnitAction(measurementUnitId)
  
  if (!measurementUnitResponse.success || !measurementUnitResponse.data) {
    notFound()
  }

  const measurementUnit = measurementUnitResponse.data

  async function handleDeleteMeasurementUnit() {
    "use server"

    const result = await deleteMeasurementUnitAction(measurementUnitId)
    
    if (result.success) {
      redirect("/measurement-units")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/measurement-units")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Measurement Unit</h1>
            <p className="text-gray-500">Are you sure you want to delete the unit "{measurementUnit.unitOfMeasure}"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the measurement unit and may affect products using this unit.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/measurement-units">Cancel</Link>
            </Button>

            <form action={handleDeleteMeasurementUnit}>
              <Button type="submit" variant="destructive">
                Delete Unit
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}