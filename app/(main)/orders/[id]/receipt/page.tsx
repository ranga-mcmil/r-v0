// app/(main)/orders/[id]/receipt/page.tsx
import { notFound } from "next/navigation"
import { getOrderAction } from "@/actions/orders"
import { PrintableReceipt } from "./components/printable-receipt"

interface ReceiptPageProps {
  params: {
    id: string
  }
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const orderId = parseInt(params.id)

  if (isNaN(orderId)) {
    notFound()
  }

  // Fetch the order
  const orderResponse = await getOrderAction(orderId)

  if (!orderResponse.success || !orderResponse.data) {
    notFound()
  }

  const order = orderResponse.data

  // Only show receipt for orders with payments
  if (order.paidAmount <= 0) {
    notFound()
  }

  return <PrintableReceipt order={order} />
}