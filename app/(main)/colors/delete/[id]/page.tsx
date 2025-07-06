// app/(main)/colors/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getColorAction, deleteColorAction } from "@/actions/colors"
import { notFound } from "next/navigation"

interface DeleteColorPageProps {
  params: {
    id: string
  }
}

export default async function DeleteColorPage({ params }: DeleteColorPageProps) {
  const colorId = parseInt(params.id)

  if (isNaN(colorId)) {
    notFound()
  }

  // Find the color using existing action
  const colorResponse = await getColorAction(colorId)
  
  if (!colorResponse.success || !colorResponse.data) {
    notFound()
  }

  const color = colorResponse.data

  async function handleDeleteColor() {
    "use server"

    const result = await deleteColorAction(colorId)
    
    if (result.success) {
      redirect("/colors")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/colors")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Color</h1>
            <p className="text-gray-500">Are you sure you want to delete the color "{color.name}"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the color and may affect products using this color.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/colors">Cancel</Link>
            </Button>

            <form action={handleDeleteColor}>
              <Button type="submit" variant="destructive">
                Delete Color
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}