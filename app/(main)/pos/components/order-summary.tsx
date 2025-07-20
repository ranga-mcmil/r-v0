// app/(main)/pos/components/order-summary.tsx
"use client"

interface LayawayPlan {
  depositAmount: number
  numberOfInstallments: number
  installmentFrequencyDays: number
  firstInstallmentDate: string
}

interface OrderSummaryProps {
  subtotal: number
  total: number
  orderType: string
  layawayPlan: LayawayPlan
  calculatedInstallmentAmount: number
  paymentAmount: string
}

export function OrderSummary({ 
  subtotal, 
  total, 
  orderType, 
  layawayPlan, 
  calculatedInstallmentAmount, 
  paymentAmount 
}: OrderSummaryProps) {
  const DEFAULT_WIDTH = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_WIDTH || '1')

  return (
    <div className="space-y-2 pt-4 border-t">
      <div className="flex justify-between font-medium text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      {/* Layaway Summary */}
      {orderType === "LAYAWAY" && layawayPlan.depositAmount > 0 && (
        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
          <div className="text-xs text-blue-800 font-medium mb-1">Layaway Breakdown:</div>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex justify-between">
              <span>Deposit today:</span>
              <span>${layawayPlan.depositAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining balance:</span>
              <span>${(total - layawayPlan.depositAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{layawayPlan.numberOfInstallments} installments of:</span>
              <span>${calculatedInstallmentAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment amount validation for immediate sales */}
      {orderType === "IMMEDIATE_SALE" && paymentAmount && (
        <div className="mt-2">
          {parseFloat(paymentAmount) < total ? (
            <div className="text-sm text-red-600">
              Insufficient payment amount. ${(total - parseFloat(paymentAmount)).toFixed(2)} remaining.
            </div>
          ) : parseFloat(paymentAmount) > total ? (
            <div className="text-sm text-green-600">
              Change: ${(parseFloat(paymentAmount) - total).toFixed(2)}
            </div>
          ) : (
            <div className="text-sm text-green-600">
              Exact payment amount
            </div>
          )}
        </div>
      )}
    </div>
  )
}