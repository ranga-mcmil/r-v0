// app/(main)/referral-payments/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { ReferralPaymentDTO } from "@/lib/http-service/referral-payments/types"

interface ExportButtonProps {
  payments: ReferralPaymentDTO[]
}

export function ExportButton({ payments }: ExportButtonProps) {
  const headers = ["ID", "Referral Name", "Amount", "Order Number", "Order Status", "Payment Status"]
  
  // Transform payments data to match headers
  const exportData = payments.map(payment => ({
    id: payment.id,
    fullName: payment.fullName,
    referralAmount: payment.referralAmount,
    orderNumber: payment.orderNumber,
    orderStatus: payment.orderStatus,
    paymentStatus: payment.paymentStatus,
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="referral_payments_export"
      headers={headers}
    />
  )
}
