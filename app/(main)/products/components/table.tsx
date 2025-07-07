// app/(main)/products/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import type { ProductDTO } from "@/lib/http-service/products/types"

interface ProductsTableProps {
  products: ProductDTO[]
}

export function ProductsTable({ products = [] }: ProductsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Branch</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!products || products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    {product.name || `Product ${product.code}`}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    {product.code}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    {product.colorName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    {product.productCategoryName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    {formatCurrency(product.price)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    <span className={product.stockQuantity <= 10 ? "text-red-600 font-medium" : ""}>
                      {product.stockQuantity}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product.id}`} className="block hover:underline">
                    {product.branchName}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}