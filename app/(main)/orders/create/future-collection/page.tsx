// app/(main)/orders/create/future-collection/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { OrderFormClient } from "../../components/order-form-client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

export default async function CreateFutureCollectionPage() {
  // Get session to ensure user has branch access
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Future Collection</h1>
            <p className="text-muted-foreground">Paid order with scheduled collection date</p>
          </div>
        </div>

        <Card className="p-6">
          <OrderFormClient 
            orderType="FUTURE_COLLECTION" 
            returnUrl="/orders" 
          />
        </Card>
      </main>
    </div>
  )
}