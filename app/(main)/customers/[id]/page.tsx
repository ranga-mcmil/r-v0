// app/(main)/customers/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, MapPin, Building, Hash, Receipt } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCustomerAction } from "@/actions/customers"
import { Actions } from "../components/actions"

interface CustomerDetailsPageProps {
  params: {
    id: string
  }
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const customerId = parseInt(params.id)

  if (isNaN(customerId)) {
    notFound()
  }

  // Fetch data server-side using existing action
  const customerResponse = await getCustomerAction(customerId)
  
  if (!customerResponse.success || !customerResponse.data) {
    notFound()
  }

  const customer = customerResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{customer.firstName} {customer.lastName}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Customer ID: {customer.id}</span>
              </div>
            </div>
          </div>
          <Actions customerId={customer.id} customerName={`${customer.firstName} ${customer.lastName}`} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{customer.firstName} {customer.lastName}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phoneNumber}</span>
              </div>
              {customer.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.address}</span>
                </div>
              )}
              {customer.tin && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>TIN: {customer.tin}</span>
                </div>
              )}
              {customer.vatNumber && (
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span>VAT: {customer.vatNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total orders:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total spent:</span>
                  <span className="text-sm font-medium">$0.00</span>
                </div>
                <div className="text-sm text-muted-foreground">No orders found for this customer</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
