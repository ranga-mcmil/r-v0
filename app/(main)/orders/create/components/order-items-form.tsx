// app/(main)/orders/create/components/order-items-form.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  productId: number
  productName: string
  quantity: number
  length: number
  width: number
  unitPrice: number
  discount: number
  notes?: string
}

interface OrderItemsFormProps {
  orderItems: OrderItem[]
  onOrderItemsChange: (items: OrderItem[]) => void
}

export function OrderItemsForm({ orderItems, onOrderItemsChange }: OrderItemsFormProps) {
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

  const addProduct = (product: ProductDTO) => {
    const existingIndex = orderItems.findIndex(item => item.productId === product.id)
    
    if (existingIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderItems]
      updatedItems[existingIndex].quantity += 1
      onOrderItemsChange(updatedItems)
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        length: 1,
        width: 1,
        unitPrice: product.price,
        discount: 0,
        notes: ""
      }
      onOrderItemsChange([...orderItems, newItem])
    }
    setShowProductDialog(false)
  }

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...orderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    onOrderItemsChange(updatedItems)
  }

  const removeItem = (index: number) => {
    const updatedItems = orderItems.filter((_, i) => i !== index)
    onOrderItemsChange(updatedItems)
  }

  const calculateItemTotal = (item: OrderItem) => {
    const baseTotal = item.quantity * item.length * item.width * item.unitPrice
    const discountAmount = baseTotal * (item.discount / 100)
    return baseTotal - discountAmount
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
                              {formatCurrency(product.price)}
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

      {/* Order Items Table */}
      {orderItems.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="w-20">Qty</TableHead>
                <TableHead className="w-24">Length</TableHead>
                <TableHead className="w-24">Width</TableHead>
                <TableHead className="w-24">Price</TableHead>
                <TableHead className="w-20">Disc%</TableHead>
                <TableHead className="w-24">Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <Input
                        placeholder="Notes..."
                        value={item.notes || ""}
                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.length}
                      onChange={(e) => updateItem(index, 'length', parseFloat(e.target.value) || 1)}
                      className="text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.width}
                      onChange={(e) => updateItem(index, 'width', parseFloat(e.target.value) || 1)}
                      className="text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="text-center"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(calculateItemTotal(item))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
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