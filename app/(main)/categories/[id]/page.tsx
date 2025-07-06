// app/(main)/categories/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategoryAction } from "@/actions/categories"
import { Actions } from "../components/actions"

interface CategoryDetailsPageProps {
  params: {
    id: string
  }
}

export default async function CategoryDetailsPage({ params }: CategoryDetailsPageProps) {
  const categoryId = parseInt(params.id)

  if (isNaN(categoryId)) {
    notFound()
  }

  // Fetch data server-side using existing action
  const categoryResponse = await getCategoryAction(categoryId)
  
  if (!categoryResponse.success || !categoryResponse.data) {
    notFound()
  }

  const category = categoryResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/categories">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Category ID: {category.id}</span>
              </div>
            </div>
          </div>
          <Actions categoryId={category.id} categoryName={category.name} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Category Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h3 className="font-bold">{category.name}</h3>
                <div className="text-sm text-muted-foreground">ID: {category.id}</div>
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
                  <span className="text-sm">Products in this category:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="text-sm text-muted-foreground">No products found in this category</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}