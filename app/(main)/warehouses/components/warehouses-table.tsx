import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Eye, FileText, Printer, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Warehouse } from "@/lib/types"

interface WarehousesTableProps {
  warehouses: Warehouse[]
  userCounts: Record<string, number>
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
}

export function WarehousesTable({
  warehouses,
  userCounts,
  pagination,
  currentSortField,
  currentSortDirection,
}: WarehousesTableProps) {
  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Inactive
      </Badge>
    )
  }

  // Fixed function to not use window object
  const createSortURL = (field: string) => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams()

    // Set the sort field and direction
    if (currentSortField === field) {
      params.set("sortField", field)
      params.set("sortDirection", currentSortDirection === "asc" ? "desc" : "asc")
    } else {
      params.set("sortField", field)
      params.set("sortDirection", "asc")
    }

    return `/warehouses?${params.toString()}`
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <span className="sr-only">Select</span>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("name")} className="flex items-center hover:underline">
                  Name
                  {currentSortField === "name" && (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("location")} className="flex items-center hover:underline">
                  Location
                  {currentSortField === "location" && (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("status")} className="flex items-center hover:underline">
                  Status
                  {currentSortField === "status" && (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </Link>
              </TableHead>
              <TableHead>Assigned Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No warehouses found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.location}</TableCell>
                  <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                  <TableCell>{userCounts[warehouse.id] || 0}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/warehouses/${warehouse.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/warehouses/edit/${warehouse.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/warehouses/status/${warehouse.id}?action=${warehouse.status === "active" ? "deactivate" : "activate"}`}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {warehouse.status === "active" ? "Deactivate" : "Activate"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/warehouses/print/${warehouse.id}`} target="_blank">
                            <Printer className="mr-2 h-4 w-4" /> Print
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/warehouses/delete/${warehouse.id}`}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {warehouses.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} warehouses
          </p>
          <ServerPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        </div>
      )}
    </>
  )
}

function ServerPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const createPageURL = (pageNumber: number | string) => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams()

    // Set the page parameter
    params.set("page", pageNumber.toString())

    return `/warehouses?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page, last page, current page, and pages adjacent to current
      const firstPage = 1
      const lastPage = totalPages

      // Add first page
      pageNumbers.push(firstPage)

      // Add ellipsis if needed
      if (currentPage > 3) {
        pageNumbers.push("...")
      }

      // Add pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i !== firstPage && i !== lastPage) {
          pageNumbers.push(i)
        }
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push("...")
      }

      // Add last page if not already added
      if (lastPage !== firstPage) {
        pageNumbers.push(lastPage)
      }
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        Previous
      </Link>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <Link
              key={index}
              href={createPageURL(page)}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === page
                  ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  : "text-gray-700 hover:bg-gray-50"
              } rounded-md`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          ) : (
            <span key={index} className="px-3 py-2 text-sm text-gray-700">
              {page}
            </span>
          ),
        )}
      </div>

      <Link
        href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        Next
      </Link>
    </div>
  )
}
