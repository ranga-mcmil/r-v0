// app/(main)/orders/[id]/components/layaway-details.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Calendar, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { getLayawayPaymentSummaryAction, getLayawayScheduleAction } from "@/actions/orders"

interface LayawayDetailsProps {
  orderId: number
}

export async function LayawayDetails({ orderId }: LayawayDetailsProps) {
  const [summaryResponse, scheduleResponse] = await Promise.all([
    getLayawayPaymentSummaryAction(orderId),
    getLayawayScheduleAction(orderId)
  ])

  if (!summaryResponse.success || !scheduleResponse.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Layaway Details</CardTitle>
          <CardDescription>Unable to load layaway information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            There was an error loading the layaway details.
          </p>
        </CardContent>
      </Card>
    )
  }

  const summary = summaryResponse.data
  const schedule = scheduleResponse.data

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !summary.fullyPaid
  }

  return (
    <div className="space-y-6">
      {/* Layaway Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Layaway Summary
          </CardTitle>
          <CardDescription>Payment plan progress and details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span className="font-medium">{summary.paymentProgress.toFixed(1)}%</span>
            </div>
            <Progress value={summary.paymentProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Paid: {formatCurrency(summary.totalPaid)}</span>
              <span>Total: {formatCurrency(summary.totalExpected)}</span>
            </div>
          </div>

          {/* Payment Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.paidInstallments}</div>
              <div className="text-sm text-muted-foreground">Paid Installments</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{summary.overdueInstallments}</div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </div>
          </div>

          {/* Next Payment Due */}
          {!summary.fullyPaid && summary.nextDueDate && (
            <div className={`p-3 rounded-lg border ${isOverdue(summary.nextDueDate) ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOverdue(summary.nextDueDate) ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-600" />
                  )}
                  <div>
                    <div className={`font-medium ${isOverdue(summary.nextDueDate) ? 'text-red-600' : 'text-blue-600'}`}>
                      Next Payment Due: {formatCurrency(summary.nextDueAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Due {formatDate(summary.nextDueDate)}
                      {isOverdue(summary.nextDueDate) && ' (Overdue)'}
                    </div>
                  </div>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/orders/${orderId}/payment`}>
                    Make Payment
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Fully Paid Message */}
          {summary.fullyPaid && (
            <div className="p-3 rounded-lg border border-green-200 bg-green-50">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Layaway Fully Paid</span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                All installments have been completed successfully
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payment Schedule
          </CardTitle>
          <CardDescription>
            {schedule.numberOfInstallments} installments of {formatCurrency(schedule.installmentAmount)} 
            every {schedule.installmentFrequencyDays} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Schedule Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Deposit</div>
                <div className="font-medium">{formatCurrency(schedule.depositAmount)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">First Payment</div>
                <div className="font-medium">{formatDate(schedule.firstInstallmentDate)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Final Payment</div>
                <div className="font-medium">{formatDate(schedule.finalPaymentDate)}</div>
              </div>
            </div>

            {/* Installment List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {schedule.installments.map((installment, index) => (
                <div 
                  key={installment.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    installment.paid 
                      ? 'bg-green-50 border-green-200' 
                      : installment.overdue 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      installment.paid 
                        ? 'bg-green-100 text-green-600' 
                        : installment.overdue 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {installment.installmentNumber}
                    </div>
                    <div>
                      <div className="font-medium">
                        {formatCurrency(installment.expectedAmount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {formatDate(installment.dueDate)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {installment.paid ? (
                      <div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Paid
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {installment.paidDate && formatDate(installment.paidDate)}
                        </div>
                        {installment.paidAmount !== installment.expectedAmount && (
                          <div className="text-xs text-muted-foreground">
                            Amount: {formatCurrency(installment.paidAmount)}
                          </div>
                        )}
                      </div>
                    ) : installment.overdue ? (
                      <Badge variant="destructive">
                        Overdue
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}