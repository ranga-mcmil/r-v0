// app/(main)/products/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, DollarSign, Layers, Palette, Building, Hash, Scale, AlertTriangle, Plus, TrendingUp, TrendingDown, History } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductAction } from "@/actions/products"
import { Actions } from "../components/actions"
import { formatCurrency } from "@/lib/utils"

interface ProductDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const productId = parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  // Fetch data server-side using existing action
  const productResponse = await getProductAction(productId)
  
  if (!productResponse.success || !productResponse.data) {
    notFound()
  }

  const product = productResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{product.name || `Product ${product.code}`}</h1>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
                {product.stockQuantity <= 10 && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low Stock
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Product ID: {product.id}</span>
                <span>•</span>
                <span>Code: {product.code}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Inventory Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Inventory Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Inventory Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href={`/inventory/add?productId=${product.id}`}>
                    <Plus className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Add Inventory</span>
                      <span className="text-xs text-muted-foreground">Add new stock for this product</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={`/inventory/adjust?productId=${product.id}&type=increase`}>
                    <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Increase Stock</span>
                      <span className="text-xs text-muted-foreground">Adjust stock upward</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={`/inventory/adjust?productId=${product.id}&type=decrease`}>
                    <TrendingDown className="mr-2 h-4 w-4 text-orange-600" />
                    <div className="flex flex-col">
                      <span>Decrease Stock</span>
                      <span className="text-xs text-muted-foreground">Adjust stock downward</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href={`/inventory/history/${product.id}`}>
                    <History className="mr-2 h-4 w-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span>View History</span>
                      <span className="text-xs text-muted-foreground">See all movements for this product</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Actions productId={product.id} productName={product.name || `Product ${product.code}`} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{product.name || `Product ${product.code}`}</div>
                <div className="text-sm text-muted-foreground">Product Name</div>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{product.code}</div>
                  <div className="text-sm text-muted-foreground">Product Code</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{product.colorName}</div>
                  <div className="text-sm text-muted-foreground">Color</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{product.thickness}mm</div>
                  <div className="text-sm text-muted-foreground">Thickness</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing & Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium text-lg">{formatCurrency(product.price)}</div>
                <div className="text-sm text-muted-foreground">Unit Price</div>
              </div>
              <div>
                <div className="font-medium">{product.productCategoryName}</div>
                <div className="text-sm text-muted-foreground">Category</div>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{product.unitOfMeasure}</div>
                  <div className="text-sm text-muted-foreground">Unit of Measure</div>
                </div>
              </div>
              <div>
                <div className="font-medium capitalize">{product.typeOfProduct?.replace('_', ' ').toLowerCase()}</div>
                <div className="text-sm text-muted-foreground">Product Type</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Stock & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className={`font-medium text-lg ${product.stockQuantity <= 10 ? 'text-red-600' : ''}`}>
                  {product.stockQuantity}
                </div>
                <div className="text-sm text-muted-foreground">Stock Quantity</div>
              </div>
              <div>
                <div className="font-medium">{product.branchName}</div>
                <div className="text-sm text-muted-foreground">Branch</div>
              </div>
              <div>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Current stock:</span>
                <span className="text-sm font-medium">{product.stockQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total value:</span>
                <span className="text-sm font-medium">{formatCurrency(product.price * product.stockQuantity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Recent movements:</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="text-sm text-muted-foreground">No recent inventory movements found</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}