// app/(main)/orders/create/components/product-selector.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package, Filter } from "lucide-react"
import { getProductsAction } from "@/actions/products"
import { formatCurrency } from "@/lib/utils"
import type { ProductDTO } from "@/lib/http-service/products/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrderItem {
  productId: number
  productName: string
  productCode: string
  quantity: number
  length: number
  width: number
  unitPrice: number
  discount: number
  notes?: string
  typeOfProduct: string
}

interface ProductSelectorProps {
  onProductSelect: (product: ProductDTO) => void
  selectedProducts: OrderItem[]
}

export function ProductSelector({ onProductSelect, selectedProducts }: ProductSelectorProps) {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [showProductDialog, setShowProductDialog] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const result = await getProductsAction({ pageSize: 200 })
      if (result.success && result.data) {
        setProducts(result.data.content)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.code.toString().includes(searchTerm) ||
        product.colorName.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product =>
        product.productCategoryName.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    // Only show active products with stock
    filtered = filtered.filter(product => 
      product.isActive && (product.stockQuantity || 0) > 0
    )

    setFilteredProducts(filtered)
  }

  const handleProductSelect = (product: ProductDTO) => {
    onProductSelect(product)
    setShowProductDialog(false)
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(p => p.productCategoryName))]
    return categories.filter(Boolean).sort()
  }

  const getProductStock = (product: ProductDTO) => {
    const usedQuantity = selectedProducts
      .filter(item => item.productId === product.id)
      .reduce((sum, item) => sum + item.quantity, 0)
    
    return (product.stockQuantity || 0) - usedQuantity
  }

  return (
    <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Products</DialogTitle>
          <DialogDescription>
            Choose products to add to this order
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, code, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || categoryFilter !== "all" 
                  ? 'No products found matching your criteria' 
                  : 'No active products with stock available'
                }
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const availableStock = getProductStock(product)
                  const isOutOfStock = availableStock <= 0
                  
                  return (
                    <Card 
                      key={product.id} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${isOutOfStock ? 'opacity-50' : ''}`}
                      onClick={() => !isOutOfStock && handleProductSelect(product)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm truncate">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Code: {product.code}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                            <Badge variant="outline" className="text-xs">
                              {product.typeOfProduct}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {product.thickness}mm • {product.colorName}
                            </span>
                            <span className={`font-medium ${availableStock <= 10 ? 'text-amber-600' : 'text-green-600'}`}>
                              Stock: {availableStock}
                            </span>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Category: {product.productCategoryName}
                          </div>
                          
                          {isOutOfStock && (
                            <Badge variant="destructive" className="w-full justify-center text-xs">
                              Out of Stock
                            </Badge>
                          )}
                          
                          {!isOutOfStock && availableStock <= 10 && (
                            <Badge variant="outline" className="w-full justify-center text-xs border-amber-300 text-amber-700">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Summary */}
          {filteredProducts.length > 0 && (
            <div className="text-sm text-muted-foreground text-center border-t pt-4">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {categoryFilter !== "all" && ` in ${categoryFilter}`}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}