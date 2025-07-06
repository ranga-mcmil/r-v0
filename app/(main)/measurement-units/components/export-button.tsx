// app/(main)/measurement-units/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { MeasurementUnitDTO } from "@/lib/http-service/measurement-units/types"

interface ExportButtonProps {
  measurementUnits: MeasurementUnitDTO[]
}

export function ExportButton({ measurementUnits }: ExportButtonProps) {
  const headers = ["ID", "Unit of Measure"]
  
  // Transform measurement units data to match headers
  const exportData = measurementUnits.map(unit => ({
    id: unit.id,
    unitOfMeasure: unit.unitOfMeasure,
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="measurement_units_export"
      headers={headers}
    />
  )
}