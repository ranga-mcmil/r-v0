// app/(main)/orders/[id]/components/payment-history.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Banknote, Smartphone, Building, RotateCcw } from "lucide-react"
import type { PaymentResponseDTO } from "@/lib/http-service/orders/types"

interface PaymentHistoryProps {
  payments: PaymentResponseDTO[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return Banknote
      case 'CARD':
        return CreditCard
      case 'BANK_TRANSFER':
        return Building
      case 'MOBILE_MONEY':
        return Smartphone
      default:
        return CreditCard
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Cash'
      case 'CARD':
        return 'Card'
      case 'BANK_TRANSFER':
        return 'Bank Transfer'
      case 'MOBILE_MONEY':
        return 'Mobile Money'
      case 'MIXED':
        return 'Mixed Payment'
      default:
        return method
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>No payments recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No payments have been made for this order yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalPaid = payments
    .filter(payment => !payment.reversed)
    .reduce((sum, payment) => sum + payment.amount, 0)

  const reversedAmount = payments
    .filter(payment => payment.reversed)
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          {payments.length} payment{payments.length !== 1 ? 's' : ''} recorded
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Total Paid:</span>
            <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
          </div>
          {reversedAmount > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Reversed:</span>
              <span className="text-red-600">-{formatCurrency(reversedAmount)}</span>
            </div>
          )}
        </div>

        {/* Payment List */}
        <div className="space-y-3">
          {payments
            .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
            .map((payment, index) => {
              const PaymentIcon = getPaymentMethodIcon(payment.paymentMethod)
              
              return (
                <div 
                  key={payment.id || index} 
                  className={`border rounded-lg p-3 ${payment.reversed ? 'bg-red-50 border-red-200' : 'bg-card'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${payment.reversed ? 'bg-red-100' : 'bg-muted'}`}>
                        {payment.reversed ? (
                          <RotateCcw className="h-4 w-4 text-red-600" />
                        ) : (
                          <PaymentIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {payment.reversed ? '-' : ''}{formatCurrency(payment.amount)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getPaymentMethodLabel(payment.paymentMethod)}
                          </Badge>
                          {payment.reversed && (
                            <Badge variant="destructive" className="text-xs">
                              Reversed
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(payment.paymentDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        by {payment.receivedBy}
                      </div>
                      {payment.paymentReference && (
                        <div className="text-xs text-muted-foreground font-mono">
                          Ref: {payment.paymentReference}
                        </div>
                      )}
                    </div>
                  </div>

                  {payment.notes && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{payment.notes}</p>
                    </div>
                  )}

                  {payment.reversed && payment.reversalReason && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <div className="text-sm text-red-600">
                        <span className="font-medium">Reversal Reason:</span> {payment.reversalReason}
                      </div>
                      {payment.reversedDate && (
                        <div className="text-xs text-red-500">
                          Reversed on {formatDate(payment.reversedDate)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </CardContent>
    </Card>
  )
}