// app/(main)/customers/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCustomerAction, deleteCustomerAction } from "@/actions/customers"
import { notFound } from "next/navigation"

interface DeleteCustomerPageProps {
  params: {
    id: string
  }
}

export default async function DeleteCustomerPage({ params }: DeleteCustomerPageProps) {
  const customerId = parseInt(params.id)

  if (isNaN(customerId)) {
    notFound()
  }

  // Find the customer using existing action
  const customerResponse = await getCustomerAction(customerId)
  
  if (!customerResponse.success || !customerResponse.data) {
    notFound()
  }

  const customer = customerResponse.data

  async function handleDeleteCustomer() {
    "use server"

    const result = await deleteCustomerAction(customerId)
    
    if (result.success) {
      redirect("/customers")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/customers")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Customer</h1>
            <p className="text-gray-500">Are you sure you want to delete "{customer.firstName} {customer.lastName}"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the customer and may affect their order history.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/customers">Cancel</Link>
            </Button>

            <form action={handleDeleteCustomer}>
              <Button type="submit" variant="destructive">
                Delete Customer
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
