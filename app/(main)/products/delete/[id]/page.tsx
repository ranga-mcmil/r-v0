// app/(main)/products/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getProductAction, deleteProductAction } from "@/actions/products"
import { notFound } from "next/navigation"

interface DeleteProductPageProps {
  params: {
    id: string
  }
}

export default async function DeleteProductPage({ params }: DeleteProductPageProps) {
  const productId = parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  // Find the product using existing action
  const productResponse = await getProductAction(productId)
  
  if (!productResponse.success || !productResponse.data) {
    notFound()
  }

  const product = productResponse.data

  async function handleDeleteProduct() {
    "use server"

    const result = await deleteProductAction(productId)
    
    if (result.success) {
      redirect("/products")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/products")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Product</h1>
            <p className="text-gray-500">
              Are you sure you want to delete "{product.name || `Product ${product.code}`}"?
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the product and may affect:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Inventory records ({product.stockQuantity} units in stock)</li>
              <li>Order history and references</li>
              <li>Production records</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/products">Cancel</Link>
            </Button>

            <form action={handleDeleteProduct}>
              <Button type="submit" variant="destructive">
                Delete Product
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}