// app/(main)/orders/[id]/convert/components/convert-quotation-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { convertQuotationAction } from "@/actions/orders"
import type { OrderResponseDTO, OrderType, PaymentMethod } from "@/lib/http-service/orders/types"
import { LayawayPlanForm } from "../../../create/components/layaway-plan-form"
import { PaymentForm } from "../../../create/components/payment-form"

interface LayawayPlan {
  depositAmount: number
  installmentAmount: number
  numberOfInstallments: number
  installmentFrequencyDays: number
  firstInstallmentDate: string
}

interface ConvertQuotationFormProps {
  order: OrderResponseDTO
}

export function ConvertQuotationForm({ order }: ConvertQuotationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [orderType, setOrderType] = useState<OrderType>("IMMEDIATE_SALE")
  const [paymentAmount, setPaymentAmount] = useState(order.totalAmount)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [expectedCollectionDate, setExpectedCollectionDate] = useState("")
  const [layawayPlan, setLayawayPlan] = useState<LayawayPlan | null>(null)
  const [notes, setNotes] = useState(order.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (orderType === "FUTURE_COLLECTION" && !expectedCollectionDate) {
      toast({
        title: "Collection Date Required",
        description: "Please select an expected collection date",
        variant: "destructive"
      })
      return
    }

    if (orderType === "LAYAWAY" && !layawayPlan) {
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
      
      // Keep the same order items
      formData.append('orderItems', JSON.stringify(order.orderItems.map(item => ({
        productId: item.id, // Use the item ID from the response
        quantity: item.quantity,
        length: item.length,
        width: item.width,
        discount: 0, // Original quotations don't have discount info in response
        notes: item.notes || ""
      }))))

      formData.append('notes', notes)

      // Add payment info for non-quotation orders
      if (orderType !== "QUOTATION") {
        formData.append('paymentAmount', paymentAmount.toString())
        formData.append('paymentMethod', paymentMethod)
      }

      // Add collection date for future collection
      if (orderType === "FUTURE_COLLECTION") {
        formData.append('expectedCollectionDate', expectedCollectionDate)
      }

      // Add layaway plan if needed
      if (orderType === "LAYAWAY" && layawayPlan) {
        formData.append('layawayPlan', JSON.stringify(layawayPlan))
      }

      const result = await convertQuotationAction(formData, order.id, orderType)

      if (result.success) {
        toast({
          title: "Quotation Converted",
          description: `Quotation has been converted to ${orderType.replace('_', ' ').toLowerCase()}`,
        })
        router.push(`/orders/${result.data?.id || order.id}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to convert quotation",
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

  const requiresPayment = orderType !== "QUOTATION"
  const requiresCollectionDate = orderType === "FUTURE_COLLECTION"
  const requiresLayawayPlan = orderType === "LAYAWAY"

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Quotation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Quotation</CardTitle>
              <CardDescription>Details of the quotation being converted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quotation Number</Label>
                  <div className="text-sm font-mono">{order.orderNumber}</div>
                </div>
                <div>
                  <Label>Customer</Label>
                  <div className="text-sm">{order.customerName}</div>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <div className="text-sm font-medium">{formatCurrency(order.totalAmount)}</div>
                </div>
                <div>
                  <Label>Created Date</Label>
                  <div className="text-sm">{new Date(order.createdDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              {/* Order Items Summary */}
              <div>
                <Label>Items ({order.orderItems.length})</Label>
                <div className="mt-2 space-y-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                      <span>{item.productName}</span>
                      <span>{item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Convert To */}
          <Card>
            <CardHeader>
              <CardTitle>Convert To</CardTitle>
              <CardDescription>Select the type of order to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={(value: OrderType) => setOrderType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMMEDIATE_SALE">Immediate Sale</SelectItem>
                    <SelectItem value="FUTURE_COLLECTION">Future Collection</SelectItem>
                    <SelectItem value="LAYAWAY">Layaway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
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
                  maxAmount={order.totalAmount}
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
                  totalAmount={order.totalAmount}
                  layawayPlan={layawayPlan}
                  onLayawayPlanChange={setLayawayPlan}
                />
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Any additional information about this conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any notes about this order conversion..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Conversion Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Original Total</span>
                <span className="text-sm font-medium">{formatCurrency(order.totalAmount)}</span>
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
                      {formatCurrency(order.totalAmount - paymentAmount)}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Converting To</span>
                <span className="font-bold">{orderType.replace('_', ' ')}</span>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Converting..." : `Convert to ${orderType.replace('_', ' ')}`}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/orders/${order.id}`)}
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