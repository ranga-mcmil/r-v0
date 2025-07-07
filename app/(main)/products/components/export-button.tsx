// app/(main)/products/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { ProductDTO } from "@/lib/http-service/products/types"

interface ExportButtonProps {
  products: ProductDTO[]
}

export function ExportButton({ products }: ExportButtonProps) {
  const headers = ["ID", "Name", "Code", "Color", "Thickness", "Category", "Price", "Unit", "Stock", "Status", "Branch"]
  
  // Transform products data to match headers
  const exportData = products.map(product => ({
    id: product.id,
    name: product.name,
    code: product.code,
    colorName: product.colorName,
    thickness: product.thickness,
    productCategoryName: product.productCategoryName,
    price: product.price,
    unitOfMeasure: product.unitOfMeasure,
    stockQuantity: product.stockQuantity,
    status: product.isActive ? 'Active' : 'Inactive',
    branchName: product.branchName,
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="products_export"
      headers={headers}
    />
  )
}