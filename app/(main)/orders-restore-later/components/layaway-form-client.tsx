// app/(main)/orders/components/layaway-form-client.tsx
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
import { Plus, Trash2, Calculator } from "lucide-react"
import { createLayawayAction } from "@/actions/orders"
import { getCustomersAction } from "@/actions/customers"
import { getProductsAction } from "@/actions/products"
import { formatCurrency } from "@/lib/utils"
import type { CustomerDTO } from "@/lib/http-service/customers/types"
import type { ProductDTO } from "@/lib/http-service/products/types"

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

interface LayawayPlan {
  depositAmount: number
  installmentAmount: number
  numberOfInstallments: number
  installmentFrequencyDays: number
  firstInstallmentDate: string
}

interface LayawayFormClientProps {
  returnUrl: string
  branchId?: string
}

export function LayawayFormClient({ returnUrl, branchId }: LayawayFormClientProps) {
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
  const [notes, setNotes] = useState<string>("")
  
  // Layaway plan state
  const [layawayPlan, setLayawayPlan] = useState<LayawayPlan>({
    depositAmount: 0,
    installmentAmount: 0,
    numberOfInstallments: 1,
    installmentFrequencyDays: 30,
    firstInstallmentDate: ""
  })

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadFormData()
    // Set default first installment date to 30 days from now
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 30)
    setLayawayPlan(prev => ({
      ...prev,
      firstInstallmentDate: defaultDate.toISOString().split('T')[0]
    }))
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

  const calculateLayawayPlan = () => {
    const totalAmount = getTotalAmount()
    const remainingAmount = totalAmount - layawayPlan.depositAmount
    const installmentAmount = remainingAmount / layawayPlan.numberOfInstallments
    
    setLayawayPlan(prev => ({
      ...prev,
      installmentAmount: Math.round(installmentAmount * 100) / 100
    }))
  }

  const updateLayawayPlan = (field: keyof LayawayPlan, value: any) => {
    setLayawayPlan(prev => ({ ...prev, [field]: value }))
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

    // Validate layaway plan
    if (layawayPlan.depositAmount <= 0) {
      toast({
        title: "Error",
        description: "Deposit amount must be greater than 0",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (layawayPlan.depositAmount >= getTotalAmount()) {
      toast({
        title: "Error",
        description: "Deposit amount cannot be equal to or greater than total amount",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('orderItems', JSON.stringify(orderItems))
      formData.append('notes', notes)
      formData.append('paymentAmount', paymentAmount.toString())
      formData.append('paymentMethod', paymentMethod)
      formData.append('layawayPlan', JSON.stringify(layawayPlan))

      const customerId = parseInt(selectedCustomerId)
      const result = await createLayawayAction(formData, customerId, branchId)

      if (result.success) {
        toast({
          title: "Layaway order created",
          description: "Layaway order has been created successfully",
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

      {/* Initial Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Initial Payment (Deposit)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">
                Deposit Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="paymentAmount"
                name="paymentAmount"
                type="number"
                step="0.01"
                min="0.01"
                value={paymentAmount}
                onChange={(e) => {
                  const amount = parseFloat(e.target.value) || 0
                  setPaymentAmount(amount)
                  updateLayawayPlan('depositAmount', amount)
                }}
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

      {/* Layaway Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Layaway Payment Plan</CardTitle>
            <Button type="button" variant="outline" onClick={calculateLayawayPlan}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="numberOfInstallments">
                Number of Installments <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numberOfInstallments"
                type="number"
                min="1"
                max="24"
                value={layawayPlan.numberOfInstallments}
                onChange={(e) => updateLayawayPlan('numberOfInstallments', parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installmentFrequencyDays">
                Payment Frequency (Days) <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={layawayPlan.installmentFrequencyDays.toString()} 
                onValueChange={(value) => updateLayawayPlan('installmentFrequencyDays', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Weekly (7 days)</SelectItem>
                  <SelectItem value="14">Bi-weekly (14 days)</SelectItem>
                  <SelectItem value="30">Monthly (30 days)</SelectItem>
                  <SelectItem value="60">Bi-monthly (60 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstInstallmentDate">
                First Installment Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstInstallmentDate"
                type="date"
                value={layawayPlan.firstInstallmentDate}
                onChange={(e) => updateLayawayPlan('firstInstallmentDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installmentAmount">
                Installment Amount
              </Label>
              <Input
                id="installmentAmount"
                type="number"
                step="0.01"
                value={layawayPlan.installmentAmount}
                onChange={(e) => updateLayawayPlan('installmentAmount', parseFloat(e.target.value) || 0)}
                placeholder="Auto-calculated"
                readOnly
              />
            </div>
          </div>

          {/* Payment Plan Summary */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold mb-2">Payment Plan Summary</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Order Total:</span>
                <span className="font-medium">{formatCurrency(getTotalAmount())}</span>
              </div>
              <div className="flex justify-between">
                <span>Deposit Amount:</span>
                <span className="font-medium">{formatCurrency(layawayPlan.depositAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Balance:</span>
                <span className="font-medium">{formatCurrency(getTotalAmount() - layawayPlan.depositAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Installment Amount:</span>
                <span className="font-medium">{formatCurrency(layawayPlan.installmentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Installments:</span>
                <span className="font-medium">{layawayPlan.numberOfInstallments}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Frequency:</span>
                <span className="font-medium">Every {layawayPlan.installmentFrequencyDays} days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {isSubmitting ? "Creating..." : "Create Layaway Order"}
        </Button>
      </div>
    </form>
  )
}