// app/(main)/orders/create/components/payment-form.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { OrderType } from "@/lib/http-service/orders/types"

interface PaymentFormProps {
  paymentAmount: number
  paymentMethod: string
  onPaymentAmountChange: (amount: number) => void
  onPaymentMethodChange: (method: string) => void
  maxAmount: number
  orderType: OrderType
}

export function PaymentForm({ 
  paymentAmount, 
  paymentMethod, 
  onPaymentAmountChange, 
  onPaymentMethodChange, 
  maxAmount,
  orderType 
}: PaymentFormProps) {
  const isFullPaymentRequired = orderType === "IMMEDIATE_SALE" || orderType === "FUTURE_COLLECTION"

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0
    onPaymentAmountChange(amount)
  }

  const handleQuickAmount = (percentage: number) => {
    const amount = (maxAmount * percentage) / 100
    onPaymentAmountChange(amount)
  }

  return (
    <div className="space-y-4">
      {/* Payment Amount */}
      <div className="space-y-2">
        <Label htmlFor="paymentAmount">
          Payment Amount {isFullPaymentRequired && "*"}
        </Label>
        <Input
          id="paymentAmount"
          type="number"
          min="0.01"
          max={maxAmount}
          step="0.01"
          value={paymentAmount || ""}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder="0.00"
          required={isFullPaymentRequired}
        />
        <div className="text-sm text-muted-foreground">
          Order total: {formatCurrency(maxAmount)}
        </div>
      </div>

      {/* Quick Amount Buttons */}
      {!isFullPaymentRequired && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickAmount(25)}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
          >
            25%
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(50)}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(75)}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
          >
            75%
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(100)}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
          >
            100%
          </button>
        </div>
      )}

      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method *</Label>
        <Select value={paymentMethod} onValueChange={onPaymentMethodChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="CARD">Card</SelectItem>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
            <SelectItem value="MIXED">Mixed Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Balance Display */}
      {paymentAmount > 0 && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Payment Amount:</span>
            <span className="font-medium text-green-600">{formatCurrency(paymentAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining Balance:</span>
            <span className="font-medium text-orange-600">
              {formatCurrency(maxAmount - paymentAmount)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}