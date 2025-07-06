// components/data-table/data-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SortLink, PaginationLink } from "./data-table-client"

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }
  currentSortField: string
  currentSortDirection: "asc" | "desc"
  baseUrl: string // e.g., "/warehouses", "/users"
  getItemId: (item: T) => string
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  currentSortField,
  currentSortDirection,
  baseUrl,
  getItemId,
  emptyMessage = "No items found. Try adjusting your filters."
}: DataTableProps<T>) {
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>
                  {column.sortable ? (
                    <SortLink 
                      field={String(column.key)}
                      currentSortField={currentSortField} 
                      currentSortDirection={currentSortDirection}
                      baseUrl={baseUrl}
                    >
                      {column.label}
                    </SortLink>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={getItemId(item)} className="cursor-pointer hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={column.key === columns[0].key ? "font-medium" : ""}>
                      <Link href={`${baseUrl}/${getItemId(item)}`} className="block hover:underline">
                        {column.render 
                          ? column.render(item[column.key], item)
                          : String(item[column.key] || '')
                        }
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} items
          </p>
          <DataTablePagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages}
            baseUrl={baseUrl}
          />
        </div>
      )}
    </>
  )
}

function DataTablePagination({ currentPage, totalPages, baseUrl }: { 
  currentPage: number
  totalPages: number
  baseUrl: string
}) {
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      const firstPage = 1
      const lastPage = totalPages

      pageNumbers.push(firstPage)

      if (currentPage > 3) {
        pageNumbers.push("...")
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i !== firstPage && i !== lastPage) {
          pageNumbers.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...")
      }

      if (lastPage !== firstPage) {
        pageNumbers.push(lastPage)
      }
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center space-x-2">
      <PaginationLink
        page={currentPage > 1 ? currentPage - 1 : 1}
        baseUrl={baseUrl}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        Previous
      </PaginationLink>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <PaginationLink
              key={index}
              page={page}
              baseUrl={baseUrl}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === page
                  ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  : "text-gray-700 hover:bg-gray-50"
              } rounded-md`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </PaginationLink>
          ) : (
            <span key={index} className="px-3 py-2 text-sm text-gray-700">
              {page}
            </span>
          ),
        )}
      </div>

      <PaginationLink
        page={currentPage < totalPages ? currentPage + 1 : totalPages}
        baseUrl={baseUrl}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        Next
      </PaginationLink>
    </div>
  )
}