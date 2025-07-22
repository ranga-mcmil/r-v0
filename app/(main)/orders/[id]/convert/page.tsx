// app/(main)/orders/[id]/convert/page.tsx
import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { getOrderAction } from "@/actions/orders"
import { ConvertQuotationForm } from "./components/convert-quotation-form"

interface ConvertOrderPageProps {
  params: {
    id: string
  }
}

export default async function ConvertOrderPage({ params }: ConvertOrderPageProps) {
  const orderId = parseInt(params.id)

  if (isNaN(orderId)) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Fetch the quotation
  const orderResponse = await getOrderAction(orderId)

  if (!orderResponse.success || !orderResponse.data) {
    notFound()
  }

  const order = orderResponse.data

  // Only quotations can be converted
  if (order.orderType !== 'QUOTATION') {
    redirect(`/orders/${orderId}`)
  }

  // Only pending quotations can be converted
  if (order.status !== 'PENDING') {
    redirect(`/orders/${orderId}`)
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
            <h1 className="text-2xl font-bold">Convert Quotation</h1>
            <p className="text-muted-foreground">
              Convert quotation {order.orderNumber} to an order
            </p>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ConvertQuotationForm order={order} />
        </Suspense>
      </main>
    </div>
  )
}