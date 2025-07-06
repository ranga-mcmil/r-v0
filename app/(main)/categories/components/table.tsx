// app/(main)/categories/components/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { ProductCategoryDTO } from "@/lib/http-service/categories/types"

interface CategoriesTableProps {
  categories: ProductCategoryDTO[]
}

export function CategoriesTable({ categories = [] }: CategoriesTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!categories || categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/categories/${category.id}`} className="block hover:underline">
                    {category.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/categories/${category.id}`} className="block hover:underline">
                    {category.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/categories/${category.id}`} className="block hover:underline">
                    0 {/* TODO: Get actual product count */}
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