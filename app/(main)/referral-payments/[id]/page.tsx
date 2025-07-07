    // app/(main)/referral-payments/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, DollarSign, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Actions } from "../components/actions"

interface ReferralPaymentDetailsPageProps {
  params: {
    id: string
  }
}

// Mock data for now since we don't have a get single referral payment endpoint
const getMockReferralPayment = (id: number) => {
  return {
    id: id,
    referralId: 1,
    fullName: "John Doe",
    referralAmount: 150.00,
    orderId: 1001,
    orderNumber: "ORD-2024-001",
    orderStatus: "COMPLETED",
    paymentStatus: "PENDING" as const,
    createdAt: new Date().toISOString(),
  }
}

export default async function ReferralPaymentDetailsPage({ params }: ReferralPaymentDetailsPageProps) {
  const referralPaymentId = parseInt(params.id)

  if (isNaN(referralPaymentId)) {
    notFound()
  }

  // Mock data - in real implementation, fetch from API
  const payment = getMockReferralPayment(referralPaymentId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/referral-payments">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Referral Payment #{payment.id}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>For {payment.fullName}</span>
                <Badge className={getStatusColor(payment.paymentStatus)}>
                  {payment.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
          <Actions 
            referralPaymentId={payment.id} 
            currentStatus={payment.paymentStatus}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{payment.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${payment.referralAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Order: {payment.orderNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {new Date(payment.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Status & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Payment Status:</span>
                  <Badge className={getStatusColor(payment.paymentStatus)}>
                    {payment.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Order Status:</span>
                  <span className="text-sm font-medium">{payment.orderStatus}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {payment.paymentStatus === 'PENDING' && "Awaiting approval for payment"}
                  {payment.paymentStatus === 'APPROVED' && "Approved and ready for payment"}
                  {payment.paymentStatus === 'PAID' && "Payment has been completed"}
                  {payment.paymentStatus === 'REJECTED' && "Payment has been rejected"}
                  {payment.paymentStatus === 'CANCELLED' && "Payment has been cancelled"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
