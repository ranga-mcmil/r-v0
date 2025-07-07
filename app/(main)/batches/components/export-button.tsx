// app/(main)/batches/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { BatchDTO } from "@/lib/http-service/batches/types"

interface ExportButtonProps {
  batches: BatchDTO[]
}

export function ExportButton({ batches }: ExportButtonProps) {
  const headers = ["ID", "Batch Number", "Description", "Created By", "Created Date"]
  
  // Transform batches data to match headers
  const exportData = batches.map(batch => ({
    id: batch.id,
    batchNumber: batch.batchNumber,
    description: batch.description || '',
    createdByName: batch.createdByName,
    createdDate: new Date(batch.createdDate).toLocaleDateString(),
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="batches_export"
      headers={headers}
    />
  )
}
