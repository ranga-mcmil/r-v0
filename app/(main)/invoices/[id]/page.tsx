"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Invoice } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Download, Edit, Printer, RefreshCw } from "lucide-react"
import Link from "next/link"
import { initializeDummyData } from "@/lib/dummy-data"
import { Skeleton } from "@/components/ui/skeleton"

export default function InvoiceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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

  const handlePrint = () => {
    setIsPrinting(true)

    setTimeout(() => {
      try {
        window.print()
        toast({
          title: "Print initiated",
          description: "The invoice has been sent to your printer.",
        })
      } catch (error) {
        toast({
          title: "Print failed",
          description: "There was an error sending to your printer.",
          variant: "destructive",
        })
      } finally {
        setIsPrinting(false)
      }
    }, 100)
  }

  const handleExport = () => {
    setIsExporting(true)

    setTimeout(() => {
      try {
        // In a real app, this would generate a PDF
        // For this demo, we'll just simulate a download
        const filename = `Invoice_${invoice?.invoiceNumber}_${invoice?.customerName.replace(/\s+/g, "_")}.pdf`

        // Create a fake download
        const link = document.createElement("a")
        link.href = "#"
        link.setAttribute("download", filename)
        link.click()

        toast({
          title: "Invoice exported",
          description: `Invoice has been exported as ${filename}`,
        })
      } catch (error) {
        toast({
          title: "Export failed",
          description: "There was an error exporting the invoice.",
          variant: "destructive",
        })
      } finally {
        setIsExporting(false)
      }
    }, 1000)
  }

  const handleMarkAsPaid = () => {
    if (!invoice) return

    setIsMarkingAsPaid(true)

    setTimeout(() => {
      try {
        // Update invoice status
        const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]
        const updatedInvoices = savedInvoices.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: "paid", paymentDate: new Date().toISOString() } : inv,
        )
        localStorage.setItem("invoices", JSON.stringify(updatedInvoices))

        // Update local state
        setInvoice((prev) => (prev ? { ...prev, status: "paid", paymentDate: new Date().toISOString() } : null))

        toast({
          title: "Invoice marked as paid",
          description: `Invoice #${invoice.invoiceNumber} has been marked as paid.`,
        })
      } catch (error) {
        toast({
          title: "Update failed",
          description: "There was an error updating the invoice status.",
          variant: "destructive",
        })
      } finally {
        setIsMarkingAsPaid(false)
      }
    }, 1000)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Paid</Badge>
      case "unpaid":
        return <Badge variant="outline">Unpaid</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Skeleton className="h-7 w-[200px] mb-1" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-[100px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-[120px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[80px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Invoice Not Found</h1>
            </div>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">The requested invoice could not be found.</p>
              <Button asChild>
                <Link href="/invoices">Return to Invoices</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
              <p className="text-muted-foreground">
                {new Date(invoice.date).toLocaleDateString()} • {getStatusBadge(invoice.status)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
              <Printer className="mr-2 h-4 w-4" /> {isPrinting ? "Printing..." : "Print"}
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/invoices/edit/${invoice.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            {invoice.status !== "paid" && (
              <Button onClick={handleMarkAsPaid} disabled={isMarkingAsPaid}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isMarkingAsPaid ? "animate-spin" : ""}`} />
                {isMarkingAsPaid ? "Processing..." : "Mark as Paid"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h3 className="font-bold">{invoice.customerName}</h3>
                <p className="text-sm">{invoice.customerId}</p>
                {/* In a real app, we would show more customer details here */}
                <p className="text-sm text-muted-foreground">Customer since {new Date(invoice.date).getFullYear()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Invoice Date:</span>
                  <span className="text-sm font-medium">{new Date(invoice.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Due Date:</span>
                  <span className="text-sm font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                {invoice.status === "paid" && invoice.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-sm">Payment Date:</span>
                    <span className="text-sm font-medium">{new Date(invoice.paymentDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm">Status:</span>
                  <span className="text-sm font-medium">{getStatusBadge(invoice.status)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card ref={invoiceRef}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="space-y-2 text-right">
              <div className="flex justify-end">
                <span className="w-[150px] text-sm">Subtotal:</span>
                <span className="w-[100px] text-right font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-end text-muted-foreground">
                  <span className="w-[150px] text-sm">Discount:</span>
                  <span className="w-[100px] text-right font-medium">-${invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-end">
                <span className="w-[150px] text-sm">Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
                <span className="w-[100px] text-right font-medium">${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-end">
                <span className="w-[150px] text-base font-medium">Total:</span>
                <span className="w-[100px] text-right text-base font-bold">${invoice.total.toFixed(2)}</span>
              </div>
            </div>

            {invoice.notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
