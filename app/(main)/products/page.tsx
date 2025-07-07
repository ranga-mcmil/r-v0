// app/(main)/products/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Palette, Layers, Tag, Ruler } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductsTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getProductsAction } from "@/actions/products"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

export default async function ProductsPage() {
  // Get session for role-based access
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // For SALES_REP and MANAGER, filter by their branch
  const branchFilter = session.user.branchId ? { branchId: session.user.branchId } : undefined

  // Fetch data server-side using existing actions
  let products: any[] = []
  
  try {
    const productsResponse = await getProductsAction(branchFilter)
    products = (productsResponse.success && productsResponse.data) ? productsResponse.data.content : []
  } catch (error) {
    console.error('Error fetching products:', error)
    products = []
  }

  // Calculate stats
  const activeProducts = products.filter(p => p.isActive).length
  const inactiveProducts = products.filter(p => !p.isActive).length
  const lowStockProducts = products.filter(p => p.stockQuantity <= 10).length

  const stats = {
    totalProducts: products.length,
    activeProducts,
    inactiveProducts,
    lowStockProducts,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage product catalog and inventory</p>
          </div>
          <div className="flex gap-2">
            <ExportButton products={products} />
            
            {/* Product Attributes Management Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Attributes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Product Attributes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/categories">
                    <Tag className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Categories</span>
                      <span className="text-xs text-muted-foreground">Manage product categories</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/colors">
                    <Palette className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Colors</span>
                      <span className="text-xs text-muted-foreground">Manage product colors</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/thicknesses">
                    <Layers className="mr-2 h-4 w-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span>Thicknesses</span>
                      <span className="text-xs text-muted-foreground">Manage material thickness</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/measurement-units">
                    <Ruler className="mr-2 h-4 w-4 text-orange-600" />
                    <div className="flex flex-col">
                      <span>Measurement Units</span>
                      <span className="text-xs text-muted-foreground">Manage units of measure</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button asChild>
              <Link href="/products/create">
                <Plus className="mr-2 h-4 w-4" /> New Product
              </Link>
            </Button>
          </div>
        </div>

        <Stats 
          totalProducts={stats.totalProducts}
          activeProducts={stats.activeProducts}
          inactiveProducts={stats.inactiveProducts}
          lowStockProducts={stats.lowStockProducts}
        />

        <div className="border rounded-lg p-2">
          <ProductsTable products={products} />
        </div>
      </main>
    </div>
  )
}