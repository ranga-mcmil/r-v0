// app/(main)/orders/create/future-collection/page.tsx
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"
import { OrderForm } from "../components/order-form"
import { createFutureCollectionAction } from "@/actions/orders"

export default async function CreateFutureCollectionPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

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
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Future Collection Order</h1>
            <p className="text-muted-foreground">
              Full payment now, customer collects later
            </p>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <OrderForm 
            orderType="FUTURE_COLLECTION"
            createAction={createFutureCollectionAction}
          />
        </Suspense>
      </main>
    </div>
  )
}