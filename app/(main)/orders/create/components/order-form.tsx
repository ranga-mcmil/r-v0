// app/(main)/orders/create/components/order-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CustomerSelector } from "./customer-selector"
import { OrderItemsForm } from "./order-items-form"
import { PaymentForm } from "./payment-form"
import { LayawayPlanForm } from "./layaway-plan-form"
import { formatCurrency } from "@/lib/utils"
import type { OrderType } from "@/lib/http-service/orders/types"
import type { APIResponse } from "@/lib/http-service/apiClient"

interface OrderFormProps {
  orderType: OrderType
  createAction: (formData: FormData, customerId: number) => Promise<APIResponse<any, any>>
}

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

interface LayawayPlan {
  depositAmount: number
  installmentAmount: number
  numberOfInstallments: number
  installmentFrequencyDays: number
  firstInstallmentDate: string
}

export function OrderForm({ orderType, createAction }: OrderFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [notes, setNotes] = useState("")
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [expectedCollectionDate, setExpectedCollectionDate] = useState("")
  const [layawayPlan, setLayawayPlan] = useState<LayawayPlan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => {
    const itemTotal = item.quantity * item.length * item.width * item.unitPrice
    const discountAmount = itemTotal * (item.discount / 100)
    return sum + (itemTotal - discountAmount)
  }, 0)

  const requiresPayment = orderType !== "QUOTATION"
  const requiresCollectionDate = orderType === "FUTURE_COLLECTION"
  const requiresLayawayPlan = orderType === "LAYAWAY"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCustomerId) {
      toast({
        title: "Customer Required",
        description: "Please select a customer for this order",
        variant: "destructive"
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Items Required", 
        description: "Please add at least one item to the order",
        variant: "destructive"
      })
      return
    }

    if (requiresPayment && paymentAmount <= 0) {
      toast({
        title: "Payment Required",
        description: "Please enter a payment amount",
        variant: "destructive"
      })
      return
    }

    if (requiresCollectionDate && !expectedCollectionDate) {
      toast({
        title: "Collection Date Required",
        description: "Please select an expected collection date",
        variant: "destructive"
      })
      return
    }

    if (requiresLayawayPlan && !layawayPlan) {
      toast({
        title: "Layaway Plan Required",
        description: "Please configure the layaway payment plan",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Add order items
      formData.append('orderItems', JSON.stringify(orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        length: item.length,
        width: item.width,
        discount: item.discount,
        notes: item.notes || ""
      }))))

      // Add notes
      if (notes) {
        formData.append('notes', notes)
      }

      // Add payment info if required
      if (requiresPayment) {
        formData.append('paymentAmount', paymentAmount.toString())
        formData.append('paymentMethod', paymentMethod)
      }

      // Add collection date if required
      if (requiresCollectionDate) {
        formData.append('expectedCollectionDate', expectedCollectionDate)
      }

      // Add layaway plan if required
      if (requiresLayawayPlan && layawayPlan) {
        formData.append('layawayPlan', JSON.stringify(layawayPlan))
      }

      const result = await createAction(formData, selectedCustomerId)

      if (result.success) {
        toast({
          title: "Order Created",
          description: `${orderType.replace('_', ' ')} has been created successfully`,
        })
        router.push(`/orders/${result.data?.id || '/orders'}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create order",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
              <CardDescription>Select the customer for this order</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerSelector 
                onCustomerSelect={setSelectedCustomerId}
                selectedCustomerId={selectedCustomerId}
              />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Add products to this order</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderItemsForm 
                orderItems={orderItems}
                onOrderItemsChange={setOrderItems}
              />
            </CardContent>
          </Card>

          {/* Payment Form */}
          {requiresPayment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  {orderType === "IMMEDIATE_SALE" && "Full payment required"}
                  {orderType === "FUTURE_COLLECTION" && "Full payment required"}
                  {orderType === "LAYAWAY" && "Initial deposit or payment"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentForm
                  paymentAmount={paymentAmount}
                  paymentMethod={paymentMethod}
                  onPaymentAmountChange={setPaymentAmount}
                  onPaymentMethodChange={setPaymentMethod}
                  maxAmount={subtotal}
                  orderType={orderType}
                />
              </CardContent>
            </Card>
          )}

          {/* Collection Date */}
          {requiresCollectionDate && (
            <Card>
              <CardHeader>
                <CardTitle>Collection Date</CardTitle>
                <CardDescription>When will the customer collect this order?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="collectionDate">Expected Collection Date</Label>
                  <Input
                    id="collectionDate"
                    type="date"
                    value={expectedCollectionDate}
                    onChange={(e) => setExpectedCollectionDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Layaway Plan */}
          {requiresLayawayPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Layaway Payment Plan</CardTitle>
                <CardDescription>Configure the payment schedule for this order</CardDescription>
              </CardHeader>
              <CardContent>
                <LayawayPlanForm
                  totalAmount={subtotal}
                  layawayPlan={layawayPlan}
                  onLayawayPlanChange={setLayawayPlan}
                />
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Any additional information about this order</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any notes about this order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Items</span>
                <span className="text-sm font-medium">{orderItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {requiresPayment && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Payment</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(paymentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Balance</span>
                    <span className="text-sm font-medium text-orange-600">
                      {formatCurrency(subtotal - paymentAmount)}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !selectedCustomerId || orderItems.length === 0}
              >
                {isSubmitting ? "Creating..." : `Create ${orderType.replace('_', ' ')}`}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/orders')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}