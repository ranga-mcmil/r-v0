// app/(main)/orders/create/components/order-items-form.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Trash2, Package } from "lucide-react"
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

interface OrderItem {
  id: string // Add unique ID for each cart item like POS
  productId: number
  productName: string
  quantity: number
  length: number
  width: number // Will use DEFAULT_WIDTH
  weight: number // Add weight field
  unitPrice: number
  notes?: string
  typeOfProduct: string // Add product type
}

interface OrderItemsFormProps {
  orderItems: OrderItem[]
  onOrderItemsChange: (items: OrderItem[]) => void
}

export function OrderItemsForm({ orderItems, onOrderItemsChange }: OrderItemsFormProps) {
  // Get default width from environment
  const DEFAULT_WIDTH = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_WIDTH || '1')
  
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([])
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toString().includes(searchTerm)
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products.slice(0, 20))
    }
  }, [products, searchTerm])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const result = await getProductsAction({ pageSize: 100 })
      if (result.success && result.data) {
        setProducts(result.data.content)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generate unique ID for cart items like POS
  const generateCartItemId = () => {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Always add as new item (like POS) instead of updating existing
  const addProduct = (product: ProductDTO) => {
    const newItem: OrderItem = {
      id: generateCartItemId(),
      productId: product.id,
      productName: product.name,
      quantity: 1,
      length: 1,
      width: DEFAULT_WIDTH, // Use environment variable
      weight: 1, // Default weight
      unitPrice: product.price,
      notes: "",
      typeOfProduct: product.typeOfProduct // Store product type
    }
    
    onOrderItemsChange([...orderItems, newItem])
    setShowProductDialog(false)
  }

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    const updatedItems = orderItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    onOrderItemsChange(updatedItems)
  }

  const removeItem = (id: string) => {
    const updatedItems = orderItems.filter(item => item.id !== id)
    onOrderItemsChange(updatedItems)
  }

  // Calculate item total based on product type (simplified without discount)
  const calculateItemTotal = (item: OrderItem) => {
    let baseAmount = 0
    
    switch (item.typeOfProduct) {
      case "LENGTH_WIDTH":
        // Use length * DEFAULT_WIDTH (not form width)
        baseAmount = item.unitPrice * item.quantity * item.length * DEFAULT_WIDTH
        break
      case "WEIGHT":
        baseAmount = item.unitPrice * item.quantity * item.weight
        break
      case "UNKNOWN":
      default:
        baseAmount = item.unitPrice * item.quantity
        break
    }
    
    return baseAmount
  }

  return (
    <div className="space-y-4">
      {/* Add Product Button */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Product</DialogTitle>
            <DialogDescription>
              Choose a product to add to this order
            </DialogDescription>
          </DialogHeader>
          
          {/* Product Search */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Product List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No products found matching your search' : 'No products available'}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => addProduct(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Code: {product.code} | Stock: {product.stockQuantity}
                            </div>
                            <div className="text-sm font-medium text-green-600">
                              {formatCurrency(product.price)} | Type: {product.typeOfProduct}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">Add</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Items Table - Updated with conditional fields */}
      {orderItems.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="w-20">Qty</TableHead>
                <TableHead className="w-24">Measurement</TableHead>
                <TableHead className="w-24">Unit Price</TableHead>
                <TableHead className="w-24">Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {item.typeOfProduct}
                      </Badge>
                      <Input
                        placeholder="Notes..."
                        value={item.notes || ""}
                        onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="text-center"
                    />
                  </TableCell>
                  <TableCell>
                    {/* Conditional measurement field based on product type */}
                    {item.typeOfProduct === "LENGTH_WIDTH" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Length (m)</Label>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.length}
                          onChange={(e) => updateItem(item.id, 'length', parseFloat(e.target.value) || 1)}
                          className="text-center"
                        />
                        <div className="text-xs text-muted-foreground">
                          {item.length.toFixed(2)}m
                        </div>
                      </div>
                    )}
                    {item.typeOfProduct === "WEIGHT" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Weight (kg)</Label>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.weight}
                          onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 1)}
                          className="text-center"
                        />
                        <div className="text-xs text-muted-foreground">
                          {item.weight.toFixed(2)} kg
                        </div>
                      </div>
                    )}
                    {item.typeOfProduct === "UNKNOWN" && (
                      <div className="text-center text-muted-foreground text-xs">
                        Quantity only
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Price is now read-only, not editable */}
                    <div className="text-center font-medium">
                      {formatCurrency(item.unitPrice)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(calculateItemTotal(item))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {orderItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No items added yet</p>
          <p className="text-sm">Click "Add Product" to start building your order</p>
        </div>
      )}
    </div>
  )
}