// app/(main)/categories/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { ProductCategoryDTO } from "@/lib/http-service/categories/types"

interface ExportButtonProps {
  categories: ProductCategoryDTO[]
}

export function ExportButton({ categories }: ExportButtonProps) {
  const headers = ["ID", "Name"]
  
  // Transform categories data to match headers
  const exportData = categories.map(category => ({
    id: category.id,
    name: category.name,
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="categories_export"
      headers={headers}
    />
  )
}