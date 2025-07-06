// app/(main)/colors/components/export-button.tsx
import { ExportButton } from "@/components/actions/export-button"
import type { ColorDTO } from "@/lib/http-service/colors/types"

interface ColorExportButtonProps {
  colors: ColorDTO[]
}

export function ColorExportButton({ colors }: ColorExportButtonProps) {
  const headers = ["ID", "Name"]
  
  // Transform colors data to match headers
  const exportData = colors.map(color => ({
    id: color.id,
    name: color.name,
  }))

  return (
    <ExportButton
      data={exportData}
      filename="colors_export"
      headers={headers}
    />
  )
}