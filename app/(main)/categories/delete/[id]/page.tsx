// app/(main)/categories/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCategoryAction, deleteCategoryAction } from "@/actions/categories"
import { notFound } from "next/navigation"

interface DeleteCategoryPageProps {
  params: {
    id: string
  }
}

export default async function DeleteCategoryPage({ params }: DeleteCategoryPageProps) {
  const categoryId = parseInt(params.id)

  if (isNaN(categoryId)) {
    notFound()
  }

  // Find the category using existing action
  const categoryResponse = await getCategoryAction(categoryId)
  
  if (!categoryResponse.success || !categoryResponse.data) {
    notFound()
  }

  const category = categoryResponse.data

  async function handleDeleteCategory() {
    "use server"

    const result = await deleteCategoryAction(categoryId)
    
    if (result.success) {
      redirect("/categories")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/categories")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Category</h1>
            <p className="text-gray-500">Are you sure you want to delete the category "{category.name}"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the category and may affect products in this category.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/categories">Cancel</Link>
            </Button>

            <form action={handleDeleteCategory}>
              <Button type="submit" variant="destructive">
                Delete Category
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}