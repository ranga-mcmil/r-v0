// app/(main)/referrals/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { ReferralDTO } from "@/lib/http-service/referrals/types"

interface ExportButtonProps {
  referrals: ReferralDTO[]
}

export function ExportButton({ referrals }: ExportButtonProps) {
  const headers = ["ID", "Full Name", "Phone Number", "Address"]
  
  // Transform referrals data to match headers
  const exportData = referrals.map(referral => ({
    id: referral.id,
    fullName: referral.fullName,
    phoneNumber: referral.phoneNumber,
    address: referral.address || '',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="referrals_export"
      headers={headers}
    />
  )
}
