"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InvoiceForm } from "@/components/invoice-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"
import { initializeDummyData } from "@/lib/dummy-data"
import type { Invoice } from "@/lib/types"

export default function EditInvoicePage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData()

    // Fetch invoice data
    const fetchInvoice = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]
        const foundInvoice = savedInvoices.find((s) => s.id === invoiceId)

        if (!foundInvoice) {
          toast({
            title: "Invoice not found",
            description: "The requested invoice could not be found.",
            variant: "destructive",
          })
          router.push("/invoices")
          return
        }

        setInvoice(foundInvoice)
      } catch (error) {
        console.error("Error fetching invoice:", error)
        toast({
          title: "Error",
          description: "Failed to load invoice details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [invoiceId, router, toast])

  const handleSuccess = () => {
    toast({
      title: "Invoice updated",
      description: "The invoice has been updated successfully",
    })
    router.push(`/invoices/${invoiceId}`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/invoices/${invoiceId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Invoice {invoice?.invoiceNumber}</h1>
            <p className="text-muted-foreground">Update invoice information</p>
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
            <InvoiceForm invoice={invoice || undefined} onSuccess={handleSuccess} />
          )}
        </Card>
      </main>
    </div>
  )
}
