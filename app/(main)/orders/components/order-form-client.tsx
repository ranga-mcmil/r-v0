// app/(main)/orders/components/order-form-client.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { 
  createQuotationAction, 
  createImmediateSaleAction, 
  createFutureCollectionAction, 
  createLayawayAction 
} from "@/actions/orders"
import { getCustomersAction } from "@/actions/customers"
import { getProductsAction } from "@/actions/products"
import { formatCurrency } from "@/lib/utils"
import type { CustomerDTO } from "@/lib/http-service/customers/types"
import type { ProductDTO } from "@/lib/http-service/products/types"
import type { OrderType } from "@/lib/http-service/orders/types"

interface OrderItem {
  productId: number
  quantity: number
  length: number
  width: number
  weight: number
  discount: number
  notes?: string
  unitPrice?: number
  totalPrice?: number
}

interface OrderFormClientProps {
  orderType: OrderType
  returnUrl: string
  branchId?: string
}

export function OrderFormClient({ orderType, returnUrl, branchId }: OrderFormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: 0, quantity: 1, length: 1, width: 1, weight: 1, discount: 0 }
  ])
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [expectedCollectionDate, setExpectedCollectionDate] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadFormData()
  }, [])

  const loadFormData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        getCustomersAction(),
        getProductsAction()
      ])

      if (customersRes.success && customersRes.data) {
        setCustomers(customersRes.data.content)
      }
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data.content)
      }
    } catch (error) {
      console.error("Error loading form data:", error)
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: 0, quantity: 1, length: 1, width: 1, weight: 1, discount: 0 }])
  }

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...orderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    // Calculate price when product changes
    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value))
      if (product) {
        updatedItems[index].unitPrice = product.price
        updatedItems[index].totalPrice = calculateItemTotal(updatedItems[index], product)
        
        // Reset measurement values based on product type
        if (product.typeOfProduct === 'WEIGHT') {
          updatedItems[index].length = 0
          updatedItems[index].width = 0
          updatedItems[index].weight = 1
        } else if (product.typeOfProduct === 'LENGTH_WIDTH') {
          updatedItems[index].length = 1
          updatedItems[index].width = 1
          updatedItems[index].weight = 0
        } else {
          // UNKNOWN - keep current values or set defaults
          updatedItems[index].length = 1
          updatedItems[index].width = 1
          updatedItems[index].weight = 1
        }
      }
    }
    
    // Recalculate total when quantity, measurements, or discount changes
    if (['quantity', 'length', 'width', 'weight', 'discount'].includes(field)) {
      const product = products.find(p => p.id === updatedItems[index].productId)
      if (product) {
        updatedItems[index].totalPrice = calculateItemTotal(updatedItems[index], product)
      }
    }

    setOrderItems(updatedItems)
  }

  const calculateItemTotal = (item: OrderItem, product: ProductDTO) => {
    let baseTotal = 0
    
    // Calculate based on product type
    switch (product.typeOfProduct) {
      case 'LENGTH_WIDTH':
        baseTotal = item.quantity * item.length * item.width * product.price
        break
      case 'WEIGHT':
        baseTotal = item.quantity * item.weight * product.price
        break
      case 'UNKNOWN':
      default:
        // For unknown, use length * width as fallback
        baseTotal = item.quantity * item.length * item.width * product.price
        break
    }
    
    const discountAmount = (baseTotal * item.discount) / 100
    return baseTotal - discountAmount
  }

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.totalPrice || 0), 0)
  }

  const getProductTypeLabel = (typeOfProduct: string) => {
    switch (typeOfProduct) {
      case 'LENGTH_WIDTH':
        return 'Length × Width'
      case 'WEIGHT':
        return 'Weight'
      case 'UNKNOWN':
      default:
        return 'Mixed'
    }
  }

  const renderMeasurementInputs = (item: OrderItem, index: number) => {
    const product = products.find(p => p.id === item.productId)
    if (!product) return null

    switch (product.typeOfProduct) {
      case 'LENGTH_WIDTH':
        return (
          <>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={item.length}
                onChange={(e) => updateOrderItem(index, 'length', parseFloat(e.target.value) || 1)}
                className="w-20"
                placeholder="Length"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={item.width}
                onChange={(e) => updateOrderItem(index, 'width', parseFloat(e.target.value) || 1)}
                className="w-20"
                placeholder="Width"
              />
            </TableCell>
            <TableCell>
              <span className="text-muted-foreground text-sm">-</span>
            </TableCell>
          </>
        )
      
      case 'WEIGHT':
        return (
          <>
            <TableCell>
              <span className="text-muted-foreground text-sm">-</span>
            </TableCell>
            <TableCell>
              <span className="text-muted-foreground text-sm">-</span>
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={item.weight}
                onChange={(e) => updateOrderItem(index, 'weight', parseFloat(e.target.value) || 1)}
                className="w-20"
                placeholder="Weight"
              />
            </TableCell>
          </>
        )
      
      case 'UNKNOWN':
      default:
        return (
          <>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={item.length}
                onChange={(e) => updateOrderItem(index, 'length', parseFloat(e.target.value) || 1)}
                className="w-20"
                placeholder="Length"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={item.width}
                onChange={(e) => updateOrderItem(index, 'width', parseFloat(e.target.value) || 1)}
                className="w-20"
                placeholder="Width"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={item.weight}
                onChange={(e) => updateOrderItem(index, 'weight', parseFloat(e.target.value) || 1)}
                className="w-20"
                placeholder="Weight"
              />
            </TableCell>
          </>
        )
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    if (!selectedCustomerId) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (orderItems.length === 0 || orderItems.some(item => item.productId === 0)) {
      toast({
        title: "Error",
        description: "Please add at least one valid product",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (!branchId) {
      toast({
        title: "Error",
        description: "Branch ID is required",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('orderItems', JSON.stringify(orderItems))
      formData.append('notes', notes)

      if (orderType !== 'QUOTATION') {
        formData.append('paymentAmount', paymentAmount.toString())
        formData.append('paymentMethod', paymentMethod)
      }

      if (orderType === 'FUTURE_COLLECTION') {
        formData.append('expectedCollectionDate', expectedCollectionDate)
      }

      let result
      const customerId = parseInt(selectedCustomerId)

      switch (orderType) {
        case 'QUOTATION':
          result = await createQuotationAction(formData, customerId, branchId)
          break
        case 'IMMEDIATE_SALE':
          result = await createImmediateSaleAction(formData, customerId, branchId)
          break
        case 'FUTURE_COLLECTION':
          result = await createFutureCollectionAction(formData, customerId, branchId)
          break
        case 'LAYAWAY':
          // Note: Layaway requires additional layaway plan data
          result = await createLayawayAction(formData, customerId, branchId)
          break
        default:
          throw new Error('Invalid order type')
      }

      if (result.success) {
        toast({
          title: `${orderType.replace('_', ' ')} created`,
          description: `${orderType.replace('_', ' ')} has been created successfully`,
        })
        router.push(returnUrl)
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading form data...</div>
        </div>
      </div>
    )
  }

  const requiresPayment = orderType !== 'QUOTATION'
  const requiresCollectionDate = orderType === 'FUTURE_COLLECTION'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="customerId">
              Customer <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.firstName} {customer.lastName} - {customer.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Items</CardTitle>
            <Button type="button" variant="outline" onClick={addOrderItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Width</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item, index) => {
                  const selectedProduct = products.find(p => p.id === item.productId)
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Select 
                          value={item.productId.toString()} 
                          onValueChange={(value) => updateOrderItem(index, 'productId', parseInt(value))}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name || `Product ${product.code}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {selectedProduct ? (
                          <span className="text-xs px-2 py-1 bg-muted rounded">
                            {getProductTypeLabel(selectedProduct.typeOfProduct)}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </TableCell>
                      {renderMeasurementInputs(item, index)}
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => updateOrderItem(index, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {selectedProduct ? formatCurrency(item.totalPrice || 0) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Notes"
                          value={item.notes || ''}
                          onChange={(e) => updateOrderItem(index, 'notes', e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        {orderItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOrderItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <div className="text-lg font-semibold">
              Total: {formatCurrency(getTotalAmount())}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information - Only for non-quotations */}
      {requiresPayment && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">
                  Payment Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">
                  Payment Method <span className="text-red-500">*</span>
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                    <SelectItem value="MIXED">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collection Date - Only for future collection */}
      {requiresCollectionDate && (
        <Card>
          <CardHeader>
            <CardTitle>Collection Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="expectedCollectionDate">
                Expected Collection Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expectedCollectionDate"
                name="expectedCollectionDate"
                type="date"
                value={expectedCollectionDate}
                onChange={(e) => setExpectedCollectionDate(e.target.value)}
                required={requiresCollectionDate}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes or special instructions"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : `Create ${orderType.replace('_', ' ')}`}
        </Button>
      </div>
    </form>
  )
}