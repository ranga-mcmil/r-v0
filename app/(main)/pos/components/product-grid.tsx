// app/(main)/pos/components/product-grid.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Package } from "lucide-react"
import type { ProductDTO } from "@/lib/http-service/products/types"

interface ProductGridProps {
  products: ProductDTO[]
  searchQuery: string
  onAddToCart: (product: ProductDTO) => void
  currentUserBranch?: string
}

export function ProductGrid({ products, searchQuery, onAddToCart, currentUserBranch }: ProductGridProps) {
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({})

  // Filter products - only show products from user's branch for non-admin users
  const filteredProducts = products.filter((product) => {
    // Filter by branch if user has a specific branch (Sales Rep)
    if (currentUserBranch && product.branchId !== currentUserBranch) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        product.name.toLowerCase().includes(query) ||
        product.code.toString().includes(query) ||
        product.colorName.toLowerCase().includes(query) ||
        product.productCategoryName.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleAddToCart = (product: ProductDTO) => {
    setAddedToCart(prev => ({ ...prev, [product.id]: true }))
    onAddToCart(product)

    // Reset button state after delay
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }))
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          {currentUserBranch ? 
            "No products available for your branch. Try adjusting your search." :
            "No products found. Try adjusting your search."
          }
        </div>
      ) : (
        filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-[2/1] relative bg-muted flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm">{product.name}</h3>
              <div className="mt-1 text-xs text-muted-foreground">
                {product.thickness}mm • {product.colorName}
              </div>
              <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Stock: {product.stockQuantity || 0}
                </span>
                {!product.isActive && (
                  <Badge variant="secondary">Inactive</Badge>
                )}
                {(product.stockQuantity || 0) <= 10 && product.isActive && (
                  <Badge variant="destructive">Low Stock</Badge>
                )}
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button
                onClick={() => handleAddToCart(product)}
                variant="default"
                className="w-full"
                disabled={addedToCart[product.id] || !product.isActive || (product.stockQuantity || 0) === 0}
              >
                {addedToCart[product.id] ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Added
                  </>
                ) : !product.isActive ? (
                  "Inactive"
                ) : (product.stockQuantity || 0) === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}