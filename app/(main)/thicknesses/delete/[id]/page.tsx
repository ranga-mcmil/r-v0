// app/(main)/thicknesses/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getThicknessAction, deleteThicknessAction } from "@/actions/thicknesses"
import { notFound } from "next/navigation"

interface DeleteThicknessPageProps {
  params: {
    id: string
  }
}

export default async function DeleteThicknessPage({ params }: DeleteThicknessPageProps) {
  const thicknessId = parseInt(params.id)

  if (isNaN(thicknessId)) {
    notFound()
  }

  // Find the thickness using existing action
  const thicknessResponse = await getThicknessAction(thicknessId)
  
  if (!thicknessResponse.success || !thicknessResponse.data) {
    notFound()
  }

  const thickness = thicknessResponse.data

  async function handleDeleteThickness() {
    "use server"

    const result = await deleteThicknessAction(thicknessId)
    
    if (result.success) {
      redirect("/thicknesses")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/thicknesses")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Thickness</h1>
            <p className="text-gray-500">Are you sure you want to delete the thickness "{thickness.thickness}mm"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the thickness and may affect products using this thickness.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/thicknesses">Cancel</Link>
            </Button>

            <form action={handleDeleteThickness}>
              <Button type="submit" variant="destructive">
                Delete Thickness
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}