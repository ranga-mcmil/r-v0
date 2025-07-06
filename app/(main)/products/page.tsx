import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductsTable } from "@/components/products-table"
import { Pagination } from "@/components/pagination"
import { getProducts } from "@/lib/dummy-data"

interface ProductsPageProps {
  searchParams?: {
    category?: string
    page?: string
    search?: string
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  // Get query parameters with defaults
  const category = searchParams?.category || "all"
  const currentPage = Number(searchParams?.page) || 1
  const searchQuery = searchParams?.search || ""

  // Get products data
  const allProducts = getProducts()

  // Filter products by category and search query
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = category === "all" || product.category === category
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Pagination
  const productsPerPage = 10
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // Categories for tabs
  const categories = ["all", "electronics", "clothing", "food", "furniture"]

  // Create URL with updated search parameter
  const createSearchUrl = (search: string) => {
    const params = new URLSearchParams()

    if (category !== "all") {
      params.append("category", category)
    }

    if (search) {
      params.append("search", search)
    }

    if (currentPage > 1) {
      params.append("page", currentPage.toString())
    }

    return `/products?${params.toString()}`
  }

  // Create URL with updated category parameter
  const createCategoryUrl = (selectedCategory: string) => {
    const params = new URLSearchParams()

    if (selectedCategory !== "all") {
      params.append("category", selectedCategory)
    }

    if (searchQuery) {
      params.append("search", searchQuery)
    }

    return `/products?${params.toString()}`
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col gap-5">
            {/* Search and filters */}
            <div className="flex items-center gap-3">
              <form action={createSearchUrl} className="flex-1">
                <Input
                  type="search"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={searchQuery}
                  className="max-w-sm"
                />
              </form>
            </div>

            {/* Category tabs */}
            <div className="border-b">
              <div className="flex flex-wrap -mb-px">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={createCategoryUrl(cat)}
                    className={cn(
                      "inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 border-transparent",
                      "hover:text-gray-700 hover:border-gray-300",
                      category === cat && "text-primary border-primary",
                    )}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Products table */}
            <ProductsTable products={paginatedProducts} />

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-center space-x-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/products"
                searchParams={{
                  ...(category !== "all" && { category }),
                  ...(searchQuery && { search: searchQuery }),
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
