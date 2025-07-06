// app/(main)/categories/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ExportButton } from "./components/export-button"
import { getCategoriesAction } from "@/actions/categories"
import { Stats } from "./components/stats"
import { CategoriesTable } from "./components/table"

export default async function CategoriesPage() {
  // Fetch data server-side using existing actions
  let categories: any[] = []
  
  try {
    const categoriesResponse = await getCategoriesAction()
    categories = (categoriesResponse.success && categoriesResponse.data) ? categoriesResponse.data : []
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories = []
  }

  const stats = {
    totalCategories: categories.length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <div className="flex gap-2">
            <ExportButton categories={categories} />
            <Button asChild>
              <Link href="/categories/create">
                <Plus className="mr-2 h-4 w-4" /> New Category
              </Link>
            </Button>
          </div>
        </div>

        <Stats totalCategories={stats.totalCategories} />

        <div className="border rounded-lg p-2">
          <CategoriesTable categories={categories} />
        </div>
      </main>
    </div>
  )
}