// app/(main)/orders/create/quotation/page.tsx
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"
import { OrderForm } from "../components/order-form"
import { createQuotationAction } from "@/actions/orders"

export default async function CreateQuotationPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Only users with branch assignment or admins can create orders
  if (session.user.role !== 'ROLE_ADMIN' && !session.user.branchId) {
    redirect("/orders")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Orders</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Quotation</h1>
            <p className="text-muted-foreground">
              Create a price estimate for your customer
            </p>
          </div>
        </div>

        {/* Order Form */}
        <Suspense fallback={<div>Loading...</div>}>
          <OrderForm 
            orderType="QUOTATION"
            createAction={createQuotationAction}
          />
        </Suspense>
      </main>
    </div>
  )
}