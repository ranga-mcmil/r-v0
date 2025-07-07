// app/(main)/customers/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { CustomerDTO } from "@/lib/http-service/customers/types"

interface ExportButtonProps {
  customers: CustomerDTO[]
}

export function ExportButton({ customers }: ExportButtonProps) {
  const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Address", "TIN", "VAT Number"]
  
  // Transform customers data to match headers
  const exportData = customers.map(customer => ({
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email || '',
    phoneNumber: customer.phoneNumber,
    address: customer.address || '',
    tin: customer.tin || '',
    vatNumber: customer.vatNumber || '',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="customers_export"
      headers={headers}
    />
  )
}