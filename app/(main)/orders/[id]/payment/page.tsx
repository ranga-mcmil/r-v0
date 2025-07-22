// app/(main)/orders/[id]/payment/page.tsx
import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { getOrderAction, getLayawayPaymentSummaryAction } from "@/actions/orders"
import { PaymentForm } from "./components/payment-form"

interface PaymentPageProps {
  params: {
    id: string
  }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const orderId = parseInt(params.id)

  if (isNaN(orderId)) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Fetch the order
  const orderResponse = await getOrderAction(orderId)

  if (!orderResponse.success || !orderResponse.data) {
    notFound()
  }

  const order = orderResponse.data

  // Only layaway orders with balance can have payments processed
  if (order.orderType !== 'LAYAWAY' || order.balanceAmount <= 0) {
    redirect(`/orders/${orderId}`)
  }

  // Fetch layaway summary for additional context
  let layawaySummary = null
  try {
    const summaryResponse = await getLayawayPaymentSummaryAction(orderId)
    if (summaryResponse.success) {
      layawaySummary = summaryResponse.data
    }
  } catch (error) {
    console.error('Failed to fetch layaway summary:', error)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/orders/${orderId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Process Payment</h1>
            <p className="text-muted-foreground">
              Process layaway payment for order {order.orderNumber}
            </p>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <PaymentForm order={order} layawaySummary={layawaySummary} />
        </Suspense>
      </main>
    </div>
  )
}