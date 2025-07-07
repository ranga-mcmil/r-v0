// app/(main)/customers/edit/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCustomerAction } from "@/actions/customers"
import { FormClient } from "../../components/form-client"

interface EditCustomerPageProps {
  params: {
    id: string
  }
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const customerId = parseInt(params.id)

  if (isNaN(customerId)) {
    notFound()
  }

  // Fetch customer data server-side using existing action
  const customerResponse = await getCustomerAction(customerId)
  
  if (!customerResponse.success || !customerResponse.data) {
    notFound()
  }

  const customer = customerResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/customers/${customerId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Customer: {customer.firstName} {customer.lastName}</h1>
            <p className="text-muted-foreground">Update customer information</p>
          </div>
        </div>

        <Card className="p-6">
          <FormClient customer={customer} returnUrl={`/customers/${customerId}`} />
        </Card>
      </main>
    </div>
  )
}
