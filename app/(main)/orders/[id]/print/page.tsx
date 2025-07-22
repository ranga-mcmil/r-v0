// app/(main)/orders/[id]/print/page.tsx
import { notFound } from "next/navigation"
import { getOrderAction } from "@/actions/orders"
import { PrintableOrder } from "./components/printable-order"

interface PrintPageProps {
  params: {
    id: string
  }
}

export default async function PrintPage({ params }: PrintPageProps) {
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

  return <PrintableOrder order={order} />
}