// app/(main)/orders/[id]/payment/components/payment-form.tsx
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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { processLayawayPaymentAction } from "@/actions/orders"
import { DollarSign, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import type { OrderResponseDTO, PaymentMethod } from "@/lib/http-service/orders/types"

interface LayawayPaymentSummary {
  orderId: number
  orderNumber: string
  totalExpected: number
  totalPaid: number
  remainingBalance: number
  totalInstallments: number
  paidInstallments: number
  overdueInstallments: number
  nextDueDate?: string
  nextDueAmount: number
  fullyPaid: boolean
  paymentProgress: number
}

interface PaymentFormProps {
  order: OrderResponseDTO
  layawaySummary: LayawayPaymentSummary | null
}

export function PaymentForm({ order, layawaySummary }: PaymentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [paymentReference, setPaymentReference] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(paymentAmount)
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      })
      return
    }

    if (amount > order.balanceAmount) {
      toast({
        title: "Amount Too High",
        description: `Payment amount cannot exceed the balance of ${formatCurrency(order.balanceAmount)}`,
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('amount', amount.toString())
      formData.append('paymentMethod', paymentMethod)
      if (paymentReference) formData.append('paymentReference', paymentReference)
      if (notes) formData.append('notes', notes)

      const result = await processLayawayPaymentAction(formData, order.id)

      if (result.success) {
        toast({
          title: "Payment Processed",
          description: `Payment of ${formatCurrency(amount)} has been recorded successfully`,
        })
        router.push(`/orders/${order.id}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to process payment",
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

  const handleQuickAmount = (percentage: number) => {
    const amount = (order.balanceAmount * percentage) / 100
    setPaymentAmount(amount.toFixed(2))
  }

  const isOverdue = layawaySummary?.nextDueDate && 
    layawaySummary.overdueInstallments > 0

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Layaway order payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
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
                  <Label>Amount Paid</Label>
                  <div className="text-sm font-medium text-green-600">{formatCurrency(order.paidAmount)}</div>
                </div>
              </div>
              
              {/* Payment Progress */}
              {layawaySummary && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span className="font-medium">{layawaySummary.paymentProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={layawaySummary.paymentProgress} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-600">{layawaySummary.paidInstallments}</div>
                      <div className="text-xs text-muted-foreground">Paid Installments</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="font-bold text-orange-600">{layawaySummary.overdueInstallments}</div>
                      <div className="text-xs text-muted-foreground">Overdue</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Payment Due */}
              {layawaySummary && layawaySummary.nextDueDate && !layawaySummary.fullyPaid && (
                <div className={`p-3 rounded-lg border ${isOverdue ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {isOverdue ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Calendar className="h-4 w-4 text-blue-600" />
                    )}
                    <span className={`font-medium text-sm ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                      Next Payment Due: {formatCurrency(layawaySummary.nextDueAmount)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Due {new Date(layawaySummary.nextDueDate).toLocaleDateString()}
                    {isOverdue && ' (Overdue)'}
                  </div>
                </div>
              )}

              {/* Fully Paid Message */}
              {layawaySummary?.fullyPaid && (
                <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Layaway Fully Paid</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter the payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Amount */}
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount *</Label>
                <div className="flex gap-2 mb-2">
                  {[25, 50, 75, 100].map(percentage => (
                    <Button
                      key={percentage}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-7"
                      onClick={() => handleQuickAmount(percentage)}
                    >
                      {percentage}%
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                    onClick={() => setPaymentAmount(order.balanceAmount.toFixed(2))}
                  >
                    Full Balance
                  </Button>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-8"
                    placeholder="Enter payment amount"
                    min="0.01"
                    max={order.balanceAmount}
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Maximum: {formatCurrency(order.balanceAmount)}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Reference */}
              <div className="space-y-2">
                <Label htmlFor="paymentReference">Payment Reference</Label>
                <Input
                  id="paymentReference"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Transaction ID, check number, etc."
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about this payment..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Current Balance</span>
                <span className="text-sm font-medium text-red-600">{formatCurrency(order.balanceAmount)}</span>
              </div>
              {paymentAmount && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Payment Amount</span>
                    <span className="text-sm font-medium text-green-600">
                      -{formatCurrency(parseFloat(paymentAmount) || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Remaining Balance</span>
                    <span className="font-bold">
                      {formatCurrency(order.balanceAmount - (parseFloat(paymentAmount) || 0))}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Schedule Info */}
          {layawaySummary && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Installments</span>
                  <span>{layawaySummary.totalInstallments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span className="text-green-600">{layawaySummary.paidInstallments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span className="text-orange-600">
                    {layawaySummary.totalInstallments - layawaySummary.paidInstallments}
                  </span>
                </div>
                {layawaySummary.overdueInstallments > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Overdue</span>
                    <span className="text-red-600">{layawaySummary.overdueInstallments}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                {isSubmitting ? "Processing..." : "Process Payment"}
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

          {/* Help Text */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>💡 <strong>Quick Tips:</strong></p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Use percentage buttons for quick amounts</li>
                  <li>Add payment reference for tracking</li>
                  <li>Payment will update the layaway schedule</li>
                  <li>Customer will be notified of payment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}