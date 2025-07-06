"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InvoiceForm } from "@/components/invoice-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { initializeDummyData } from "@/lib/dummy-data"

export default function CreateInvoicePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData()

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSuccess = () => {
    toast({
      title: "Invoice created",
      description: "The invoice has been created successfully",
    })
    router.push("/invoices")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/invoices">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Invoice</h1>
            <p className="text-muted-foreground">Create a new invoice for a customer</p>
          </div>
        </div>

        <Card className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-pulse text-center">
                <div className="h-12 w-64 bg-muted rounded mb-4 mx-auto"></div>
                <div className="h-8 w-40 bg-muted rounded mx-auto"></div>
              </div>
            </div>
          ) : (
            <InvoiceForm onSuccess={handleSuccess} />
          )}
        </Card>
      </main>
    </div>
  )
}
