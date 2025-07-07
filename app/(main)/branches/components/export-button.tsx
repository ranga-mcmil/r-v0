// app/(main)/branches/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { BranchDTO } from "@/lib/http-service/branches/types"

interface ExportButtonProps {
  branches: BranchDTO[]
}

export function ExportButton({ branches }: ExportButtonProps) {
  const headers = ["ID", "Name", "Location", "Status", "Street", "City", "Province", "Country", "Postal Code"]
  
  // Transform branches data to match headers
  const exportData = branches.map(branch => ({
    id: branch.id,
    name: branch.name,
    location: branch.location,
    status: branch.isActive ? 'Active' : 'Inactive',
    street: branch.address.street,
    city: branch.address.city,
    province: branch.address.province,
    country: branch.address.country || '',
    postalCode: branch.address.postalCode || '',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="branches_export"
      headers={headers}
    />
  )
}
