// app/(main)/thicknesses/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { ThicknessDTO } from "@/lib/http-service/thicknesses/types"

interface ExportButtonProps {
  thicknesses: ThicknessDTO[]
}

export function ExportButton({ thicknesses }: ExportButtonProps) {
  const headers = ["ID", "Thickness (mm)"]
  
  // Transform thicknesses data to match headers
  const exportData = thicknesses.map(thickness => ({
    id: thickness.id,
    thickness: thickness.thickness,
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="thicknesses_export"
      headers={headers}
    />
  )
}