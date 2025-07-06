"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Invoice } from "@/lib/types"
import { initializeDummyData } from "@/lib/dummy-data"
import { Separator } from "@/components/ui/separator"

export default function PrintInvoicePage() {
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
        const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]
        const foundInvoice = savedInvoices.find((s) => s.id === invoiceId)
        setInvoice(foundInvoice || null)

        // Auto-print after a delay
        if (foundInvoice) {
          setTimeout(() => {
            window.print()
          }, 500)
        }
      } catch (error) {
        console.error("Error fetching invoice:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [invoiceId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-12 w-64 bg-muted rounded mb-4 mx-auto"></div>
          <div className="h-8 w-40 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invoice Not Found</h1>
          <p className="text-muted-foreground">The requested invoice could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white print:p-0">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">INVOICE</h1>
          <p className="text-muted-foreground">#{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">RoofStar Industries</h2>
          <p>123 Roofing Way</p>
          <p>Metropolis, NY 10001</p>
          <p>sales@roofstar.com</p>
          <p>123-456-7890</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold mb-2">Bill To:</h3>
          <p className="font-semibold">{invoice.customerName}</p>
          <p>Customer ID: {invoice.customerId}</p>
        </div>
        <div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Invoice Date:</span>
              <span>{new Date(invoice.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Due Date:</span>
              <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
            </div>
            {invoice.status === "paid" && invoice.paymentDate && (
              <div className="flex justify-between">
                <span className="font-semibold">Payment Date:</span>
                <span>{new Date(invoice.paymentDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-t">
            <th className="py-2 text-left">Item</th>
            <th className="py-2 text-right">Quantity</th>
            <th className="py-2 text-right">Unit Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.productName}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="py-2 text-right">${item.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Discount:</span>
              <span>-${invoice.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
            <span>${invoice.taxAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mb-8">
          <h3 className="font-bold mb-2">Notes:</h3>
          <p className="text-muted-foreground">{invoice.notes}</p>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground mt-16">
        <p>Thank you for your business!</p>
        <p>This invoice was generated by the RoofStar POS System</p>
      </div>
    </div>
  )
}
